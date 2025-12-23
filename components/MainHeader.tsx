import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/base-button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle, UsersRound } from "lucide-react";
import NewChatDialog from "./NewChatDialog";

const MainHeader = () => {
  return (
    <header className="flex items-center justify-between gap-4 border-b p-4">
      <Icons.balz_logo_name className="h-8 w-auto" />
      <div>
        <NewChatDialog />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                mode="icon"
                radius="full"
                size="lg"
                className="text-primary/50 hover:text-primary"
              >
                <UsersRound className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New Group</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default MainHeader;
