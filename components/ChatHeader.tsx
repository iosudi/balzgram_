"use client";

import { getAvatarInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useChatStore } from "@/store/chatStore";

const ChatHeader = () => {
  const chat = useChatStore((s) => s.activeChat);

  if (!chat) return null;

  return (
    <header className="p-4 border-b">
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          <AvatarImage src={chat.avatar} />
          <AvatarFallback>{getAvatarInitial(chat.name)}</AvatarFallback>
        </Avatar>
        <div className="-space-y-0.5">
          <h2 className="text-base">{chat.name}</h2>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
