import { ChatItem as IChatItem } from "@/types/Chats.type";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ChatItem = ({ chat }: { chat: IChatItem }) => {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl">
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div>
        <p className="text-lg font-semibold">{chat.name}</p>
        <p className="text-gray-500">{chat.lastMessagePreview}</p>
      </div>
    </div>
  );
};

export default ChatItem;
