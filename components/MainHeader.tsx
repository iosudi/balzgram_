import { Icons } from "@/components/Icons";

import NewChatDialog from "./NewChatDialog";
import NewGroupDialog from "./NewGroupDialog";

const MainHeader = () => {
  return (
    <header className="flex items-center justify-between gap-4 border-b p-4">
      <Icons.balz_logo_name className="h-8 w-auto" />
      <div>
        <NewChatDialog />
        <NewGroupDialog />
      </div>
    </header>
  );
};

export default MainHeader;
