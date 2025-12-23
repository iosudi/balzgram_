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
import { PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";
import { startPrivateChat } from "@/actions/chats";
import { useToast } from "@/hooks/use-toast";

const NewChatDialog = () => {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    startTransition(async () => {
      try {
        await startPrivateChat(query);
        setQuery("");
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
                <PlusCircle className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">
            Start Private Chat
          </DialogTitle>
          <DialogDescription>
            Enter the username of the person you want to chat with.
          </DialogDescription>

          <form onSubmit={onSubmit} className="mt-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              name="username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="mt-3 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Starting..." : "Start Chat"}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
