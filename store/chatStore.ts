import { create } from "zustand";
import * as signalR from "@microsoft/signalr";

type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

type ChatState = {
  connection: signalR.HubConnection | null;
  isConnected: boolean;

  activeChatId: string | null;
  joinedChats: Set<string>;
  messages: Record<string, Message[]>;

  connect: (token: string) => Promise<void>;
  disconnect: () => Promise<void>;
  joinChat: (chatId: string) => Promise<void>;
  leaveChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  connection: null,
  isConnected: false,

  activeChatId: null,
  joinedChats: new Set(),
  messages: {},

  connect: async (token) => {
    const currentConnection = get().connection;

    if (currentConnection && get().isConnected) {
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

    connection.on("ReceiveMessage", (message: Message) => {
      console.log("Received message:", message);
      set((state) => ({
        messages: {
          ...state.messages,
          [message.chatId]: [
            ...(state.messages[message.chatId] || []),
            message,
          ],
        },
      }));
    });

    // 🔹 Handle reconnection
    connection.onreconnecting((error) => {
      console.log("Reconnecting to SignalR...", error);
      set({ isConnected: false });
    });

    // 🔹 Rejoin rooms after reconnect
    connection.onreconnected((connectionId) => {
      console.log("Reconnected to SignalR:", connectionId);
      set({ isConnected: true });

      const joinedChats = get().joinedChats;
      joinedChats.forEach((chatId) => {
        connection.invoke("JoinChat", chatId).catch((err) => {
          console.error(`Failed to rejoin chat ${chatId}:`, err);
        });
      });
    });

    // 🔹 Handle disconnection
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
          joinedChats: new Set(),
          activeChatId: null,
        });
      }
    }
  },

  joinChat: async (chatId: string) => {
    const { connection, isConnected, joinedChats } = get();

    if (!connection || !isConnected) {
      console.warn("SignalR not connected. Cannot join chat.");
      return;
    }

    if (joinedChats.has(chatId)) {
      // Already joined → just set active
      console.log(`Already in chat ${chatId}, setting as active`);
      set({ activeChatId: chatId });
      return;
    }

    try {
      await connection.invoke("JoinChat", chatId);
      console.log(`Successfully joined chat: ${chatId}`);

      set((state) => {
        const newJoined = new Set(state.joinedChats);
        newJoined.add(chatId);

        return {
          joinedChats: newJoined,
          activeChatId: chatId,
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId] ?? [],
          },
        };
      });
    } catch (err) {
      console.error(`Failed to join chat ${chatId}:`, err);
      throw err;
    }
  },

  leaveChat: async (chatId: string) => {
    const { connection, isConnected, joinedChats } = get();

    if (!connection || !isConnected) {
      console.warn("SignalR not connected. Cannot leave chat.");
      return;
    }

    if (!joinedChats.has(chatId)) {
      console.warn(`Not in chat ${chatId}, nothing to leave`);
      return;
    }

    try {
      await connection.invoke("LeaveChat", chatId);
      console.log(`Successfully left chat: ${chatId}`);

      set((state) => {
        const newJoined = new Set(state.joinedChats);
        newJoined.delete(chatId);

        return {
          joinedChats: newJoined,
          activeChatId:
            state.activeChatId === chatId ? null : state.activeChatId,
        };
      });
    } catch (err) {
      console.error(`Failed to leave chat ${chatId}:`, err);
      throw err;
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

  setActiveChat: (chatId: string | null) => {
    set({ activeChatId: chatId });
  },
}));
