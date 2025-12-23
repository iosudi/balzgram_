import { Message } from "@/store/chatStore";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarInitial } from "@/lib/utils";
import { IUser } from "@/types/user.type";

const MessageBubble = ({
  message,
  currentUser,
}: {
  message: Message;
  currentUser: IUser | null;
}) => {
  return (
    <div
      key={message.id}
      className={`flex flex-col ${
        message.senderUserName === currentUser?.userName
          ? "items-end"
          : "items-start"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          message.senderUserName === currentUser?.userName && "flex-row-reverse"
        }`}
      >
        <Avatar className="size-9 mb-1">
          <AvatarImage src="" />
          <AvatarFallback>
            {getAvatarInitial(message.senderUserName)}
          </AvatarFallback>
        </Avatar>

        <h5 className="text-xs">{message.senderUserName}</h5>
      </div>

      <div
        className={`max-w-[60%] w-fit rounded-lg px-4 py-2 ${
          message.senderUserName === currentUser?.userName
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
      <span className="text-neutral-500 text-xs mt-1 mr-2">
        {message.sentAtUtc
          ? new Date(message.sentAtUtc).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Just now"}
      </span>
    </div>
  );
};

export default MessageBubble;
