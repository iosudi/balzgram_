import { getToken } from "@/lib/auth";
import { ScrollArea } from "./ui/scroll-area";
import { ChatItem as IChatItem } from "@/types/Chats.type";
import ChatItem from "./ChatItem";

const getChats = async () => {
  const token = await getToken();
  const res = await fetch(`${process.env.API_URL}/chats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      cache: "no-store",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized: Please log in again.");
    } else if (res.status === 403) {
      throw new Error("Forbidden: You do not have access.");
    } else if (res.status >= 500) {
      throw new Error("Server error: Please try again later.");
    } else {
      throw new Error(`Error fetching chats: ${res.status}`);
    }
  }

  return res.json();
};

const ChatsList = async () => {
  let chats: IChatItem[];

  try {
    chats = await getChats();
    console.log(chats);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return <div className="p-4 text-red-500">{error.message}</div>;
  }

  return (
    <ScrollArea className="py-4 px-2">
      {chats?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ScrollArea>
  );
};

export default ChatsList;
