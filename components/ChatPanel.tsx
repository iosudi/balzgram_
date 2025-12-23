import React from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";

const ChatPanel = () => {
  return (
    <div>
      <ChatHeader />
      <ChatMessages />
    </div>
  );
};

export default ChatPanel;
