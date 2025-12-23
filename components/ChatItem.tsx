"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, getAvatarInitial } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { ChatItem as IChatItem } from "@/types/chats.type";

const ChatItem = ({ chat }: { chat: IChatItem }) => {
  const joinChat = useChatStore((s) => s.joinChat);
  const activeChat = useChatStore((s) => s.activeChat);

  if (!chat) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-accent",
        activeChat?.id === chat.id && "bg-primary/10 hover:bg-primary/10"
      )}
      onClick={() => joinChat(chat)}
    >
      <Avatar className="size-12">
        <AvatarImage src={chat.avatar} />
        <AvatarFallback>{getAvatarInitial(chat.name)}</AvatarFallback>
      </Avatar>

      <div>
        <h2 className="text-lg font-semibold line-clamp-1">{chat.name}</h2>
        <p className="text-gray-500 line-clamp-1 text-sm">
          {chat.lastMessagePreview || "No messages yet"}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
