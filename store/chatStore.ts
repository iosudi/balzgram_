import { create } from "zustand";
import * as signalR from "@microsoft/signalr";
import { ChatItem } from "@/types/chats.type";

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  senderUserName: string;
  content: string;
  sentAtUtc: string;
};

type MessageResponse = {
  items: Message[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
};

type ChatState = {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  token: string | null;

  activeChat: ChatItem | null;
  messages: Message[];
  currentPage: number;
  pageSize: number;
  totalMessages: number;
  hasMoreMessages: boolean;
  isLoadingMessages: boolean;

  setToken: (token: string) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  joinChat: (chat: ChatItem) => Promise<void>;
  leaveChat: () => Promise<void>;
  setActiveChat: (chat: ChatItem | null) => Promise<void>;
  fetchMessageHistory: (chatId: string, page?: number) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  connection: null,
  isConnected: false,
  token: null,

  activeChat: null,
  messages: [],
  currentPage: 1,
  pageSize: 20,
  totalMessages: 0,
  hasMoreMessages: false,
  isLoadingMessages: false,

  setToken: (token: string) => {
    set({ token });
  },

  connect: async () => {
    const { token, connection: currentConnection, isConnected } = get();

    if (!token) {
      console.error("No token available for SignalR connection");
      throw new Error("Authentication token is required");
    }

    if (currentConnection && isConnected) {
      console.log("Already connected to SignalR");
      return;
    }

    if (currentConnection) {
      try {
        await currentConnection.stop();
      } catch (err) {
        console.error("Error stopping existing connection:", err);
      }
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://balzgram.runasp.net/hubs/chat", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // 🔹 Message handler - add new message to the END (most recent)
    connection.on("ReceiveMessage", (message: Message) => {
      console.log("Received message:", message);

      const activeChat = get().activeChat;
      if (activeChat && message.chatId === activeChat.id) {
        set((state) => ({
          messages: [...state.messages, message],
          totalMessages: state.totalMessages + 1,
        }));
      }
    });

    connection.onreconnecting((error) => {
      console.log("Reconnecting to SignalR...", error);
      set({ isConnected: false });
    });

    connection.onreconnected(async (connectionId) => {
      console.log("Reconnected to SignalR:", connectionId);
      set({ isConnected: true });

      const activeChat = get().activeChat;
      if (activeChat) {
        try {
          await connection.invoke("JoinChat", activeChat.id);
          console.log(`Rejoined active chat: ${activeChat.id}`);
        } catch (err) {
          console.error(`Failed to rejoin chat ${activeChat.id}:`, err);
        }
      }
    });

    connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      set({ isConnected: false });
    });

    try {
      await connection.start();
      console.log("SignalR connected successfully");
      set({ connection, isConnected: true });
    } catch (err) {
      console.error("Failed to connect to SignalR:", err);
      set({ connection: null, isConnected: false });
      throw err;
    }
  },

  disconnect: async () => {
    const conn = get().connection;
    if (conn) {
      try {
        await conn.stop();
        console.log("SignalR disconnected");
      } catch (err) {
        console.error("Error disconnecting SignalR:", err);
      } finally {
        set({
          connection: null,
          isConnected: false,
          activeChat: null,
          messages: [],
          currentPage: 1,
          totalMessages: 0,
          hasMoreMessages: false,
        });
      }
    }
  },

  joinChat: async (chat: ChatItem) => {
    const { connection, isConnected } = get();

    if (!connection || !isConnected) {
      console.warn("SignalR not connected. Cannot join chat.");
      throw new Error("Not connected to chat server");
    }

    try {
      await connection.invoke("JoinChat", chat.id);
      console.log(`Successfully joined chat: ${chat.id}`);

      set({
        activeChat: chat,
        messages: [],
        currentPage: 1,
        totalMessages: 0,
        hasMoreMessages: false,
      });

      await get().fetchMessageHistory(chat.id, 1);
    } catch (err) {
      console.error(`Failed to join chat ${chat.id}:`, err);
      throw err;
    }
  },

  leaveChat: async () => {
    const { connection, isConnected, activeChat } = get();

    if (!activeChat) {
      console.warn("No active chat to leave");
      return;
    }

    if (!connection || !isConnected) {
      console.warn("SignalR not connected. Cannot leave chat.");
      return;
    }

    try {
      await connection.invoke("LeaveChat", activeChat.id);
      console.log(`Successfully left chat: ${activeChat.id}`);

      set({
        activeChat: null,
        messages: [],
        currentPage: 1,
        totalMessages: 0,
        hasMoreMessages: false,
      });
    } catch (err) {
      console.error(`Failed to leave chat ${activeChat.id}:`, err);
      throw err;
    }
  },

  fetchMessageHistory: async (chatId: string, page: number = 1) => {
    const { token, pageSize } = get();

    if (!token) {
      console.error("No token available for fetching messages");
      return;
    }

    set({ isLoadingMessages: true });

    try {
      const response = await fetch(
        `https://balzgram.runasp.net/api/chats/${chatId}/messages?pageNumber=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch message history");
      }

      const data: MessageResponse = await response.json();

      // For first page, replace messages. For subsequent pages, prepend older messages
      set((state) => ({
        messages: page === 1 ? data.items : [...data.items, ...state.messages], // Prepend older messages
        currentPage: data.pageNumber,
        totalMessages: data.totalCount,
        hasMoreMessages: data.pageNumber * data.pageSize < data.totalCount,
        isLoadingMessages: false,
      }));

      console.log(`Fetched ${data.items.length} messages for chat ${chatId}`);
    } catch (err) {
      console.error(`Failed to fetch message history for chat ${chatId}:`, err);
      set({ isLoadingMessages: false });
      throw err;
    }
  },

  loadMoreMessages: async () => {
    const { activeChat, currentPage, hasMoreMessages, isLoadingMessages } =
      get();

    if (!activeChat || !hasMoreMessages || isLoadingMessages) {
      return;
    }

    await get().fetchMessageHistory(activeChat.id, currentPage + 1);
  },

  setActiveChat: async (chat: ChatItem | null) => {
    const { activeChat } = get();

    if (activeChat?.id === chat?.id) {
      return;
    }

    if (activeChat) {
      await get().leaveChat();
    }

    if (chat) {
      await get().joinChat(chat);
    }
  },

  sendMessage: async (chatId: string, content: string) => {
    const { connection, isConnected } = get();

    if (!connection || !isConnected) {
      console.warn("SignalR not connected. Cannot send message.");
      throw new Error("Not connected to chat server");
    }

    try {
      await connection.invoke("SendMessage", chatId, content);
      console.log(`Message sent to chat ${chatId}`);
    } catch (err) {
      console.error(`Failed to send message to chat ${chatId}:`, err);
      throw err;
    }
  },
}));
