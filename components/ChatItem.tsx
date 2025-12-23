"use client";

import { ChatItem as IChatItem } from "@/types/Chats.type";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarInitial, getOtherUserName } from "@/lib/utils";
import { useAuth } from "@/Contexts/AuthContext";

const ChatItem = ({ chat }: { chat: IChatItem }) => {
  const { user } = useAuth();

  console.log(user);

  if (!chat || !user) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl">
      <Avatar className="size-12">
        <AvatarImage src="" />
        <AvatarFallback>{getAvatarInitial(user, chat.name)}</AvatarFallback>
      </Avatar>

      <div>
        <h2 className="text-lg font-semibold line-clamp-1">
          {getOtherUserName(user, chat.name)}
        </h2>
        <p className="text-gray-500 line-clamp-1">{chat.lastMessagePreview}</p>
      </div>
    </div>
  );
};

export default ChatItem;
