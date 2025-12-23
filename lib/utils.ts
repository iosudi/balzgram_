import { IUser } from "@/types/user.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOtherUserName = (user: IUser, chatName: string): string => {
  if (!user || !chatName) return chatName || "Unknown Chat";
  if (!chatName.includes("&")) return chatName;
  const currentUserName = user.userName;
  const names = chatName
    .split("&")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  const otherName = names.find(
    (name) => name.toLowerCase() !== currentUserName.toLowerCase()
  );
  return otherName || chatName;
};

export const getAvatarInitial = (user: IUser, chatName?: string): string => {
  let displayName: string;

  if (chatName) {
    displayName = getOtherUserName(user, chatName);
  } else {
    displayName = user.userName;
  }

  return displayName?.[0]?.toUpperCase() || "U";
};
