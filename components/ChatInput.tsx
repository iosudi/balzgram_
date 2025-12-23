"use client";

import { useChatStore } from "@/store/chatStore";
import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const ChatInput = () => {
  const { activeChat, sendMessage, isConnected } = useChatStore();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || !activeChat || !isConnected) return;

    setIsSending(true);

    try {
      await sendMessage(activeChat.id, trimmedMessage);
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!activeChat) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4  mt-auto ">
      <div className="flex items-center gap-2 px-2 focus-within:ring focus-within:ring-primary/70 rounded-xl border">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isConnected ? "Type a message..." : "Connecting to chat server..."
          }
          disabled={!isConnected || isSending}
          className="min-h-10 max-h-20 resize-none border-none focus-visible:ring-0"
          rows={2}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || !isConnected || isSending}
          className="size-10"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
