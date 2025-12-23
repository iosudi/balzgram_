"use client";

import { useChatStore } from "@/store/chatStore";
import { useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import MessageBubble from "./MessageBubble";
import { useAuth } from "@/Contexts/AuthContext";

const ChatMessages = () => {
  const { user: currentUser } = useAuth();
  const {
    messages,
    isLoadingMessages,
    activeChat,
    hasMoreMessages,
    loadMoreMessages,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;

    if (scrollTop < 50 && hasMoreMessages && !isLoadingMessages) {
      const previousScrollHeight = target.scrollHeight;

      loadMoreMessages().then(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = target.scrollHeight;
          target.scrollTop = newScrollHeight - previousScrollHeight;
        });
      });
    }
  };

  if (!activeChat) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  if (isLoadingMessages && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground grow">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <ScrollArea className="h-[80vh] px-4" onScrollCapture={handleScroll}>
      <div className="flex flex-col space-y-4 py-4">
        {isLoadingMessages && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Loading older messages...
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUser={currentUser}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
