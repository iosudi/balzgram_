"use client";

import { ChatItem as IChatItem } from "@/types/Chats.type";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, getAvatarInitial, getOtherUserName } from "@/lib/utils";
import { useAuth } from "@/Contexts/AuthContext";
import { useChatStore } from "@/store/chatStore";

const ChatItem = ({ chat }: { chat: IChatItem }) => {
  const { user } = useAuth();
  const joinChat = useChatStore((s) => s.joinChat);
  const activeChat = useChatStore((s) => s.activeChatId);

  if (!chat || !user) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-accent",
        activeChat === chat.id && "bg-primary/10 hover:bg-primary/10"
      )}
      onClick={() => joinChat(chat.id)}
    >
      <Avatar className="size-12">
        <AvatarImage src={chat.avatar} />
        <AvatarFallback>{getAvatarInitial(user, chat.name)}</AvatarFallback>
      </Avatar>

      <div>
        <h2 className="text-lg font-semibold line-clamp-1">
          {getOtherUserName(user, chat.name)}
        </h2>
        <p className="text-gray-500 line-clamp-1 text-sm">
          {chat.lastMessagePreview || "No messages yet"}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
