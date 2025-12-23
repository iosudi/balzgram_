import ChatsList from "./ChatsList";
import CurrentUserCard from "./CurrentUserCard";
import MainHeader from "./MainHeader";

const ChatsBar = () => {
  return (
    <>
      <div className="flex flex-col h-full">
        <MainHeader />
        <ChatsList />
        <div className="mt-auto p-4 border-t">
          <CurrentUserCard />
        </div>
      </div>
    </>
  );
};

export default ChatsBar;
