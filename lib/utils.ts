import { IUser } from "@/types/user.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOtherUserName = (
  username: string,
  chatName: string
): string => {
  console.log(username);

  if (!username || !chatName) return chatName || "Unknown Chat";
  if (!chatName.includes("&")) return chatName;
  const currentUserName = username;
  const names = chatName
    .split("&")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  const otherName = names.find(
    (name) => name.toLowerCase() !== currentUserName.toLowerCase()
  );
  return otherName || chatName;
};

export const getAvatarInitial = (
  username: string,
  chatName?: string
): string => {
  let displayName: string;

  if (chatName) {
    displayName = getOtherUserName(username, chatName);
  } else {
    displayName = username;
  }

  return displayName?.[0]?.toUpperCase() || "U";
};
