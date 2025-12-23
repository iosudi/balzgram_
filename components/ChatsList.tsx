import { getToken } from "@/lib/auth";
import { ScrollArea } from "./ui/scroll-area";
import { ChatItem as IChatItem } from "@/types/Chats.type";
import ChatItem from "./ChatItem";

const getChats = async () => {
  try {
    const token = await getToken();
    const res = await fetch(`${process.env.API_URL}/chats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  } catch (error) {
    console.error(error);
  }
};

const ChatsList = async () => {
  const chats: IChatItem[] = await getChats();

  return (
    <ScrollArea className="py-4 px-2">
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ScrollArea>
  );
};

export default ChatsList;
