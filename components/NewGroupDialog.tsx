"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { UsersRound } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";
import { createGroupChat } from "@/actions/chats";
import { useToast } from "@/hooks/use-toast";

const NewGroupDialog = () => {
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [groupName, setGroupName] = useState("");
  const [membersInput, setMembersInput] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return toast.add({
        title: "Validation error",
        description: "Group name is required",
        type: "error",
      });
    }

    const members = membersInput
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    if (members.length === 0) {
      return toast.add({
        title: "Validation error",
        description: "Please add at least one member",
        type: "error",
      });
    }

    startTransition(async () => {
      try {
        await createGroupChat({
          name: groupName,
          initialMemberUserNames: members,
        });

        setOpen(false);
        setGroupName("");
        setMembersInput("");
      } catch (error) {
        let message = "Something went wrong";

        if (error instanceof Error) {
          message = error.message;
        }

        toast.add({
          title: "Error",
          description: message,
          type: "error",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
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
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">
            Start Group Chat
          </DialogTitle>
          <DialogDescription>
            Enter a group name and member usernames separated by commas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-3 space-y-4">
          <div>
            <Label htmlFor="group_name">Group Name</Label>
            <Input
              id="group_name"
              placeholder="My group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="members">Members</Label>
            <Input
              id="members"
              placeholder="john, jane, bob"
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupDialog;
