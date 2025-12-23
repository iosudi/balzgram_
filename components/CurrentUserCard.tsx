"use client";
import { useAuth } from "@/Contexts/AuthContext";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarInitial } from "@/lib/utils";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/logout";

const CurrentUserCard = () => {
  const { user, setUser } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center justify-between gap-4 h-12">
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{getAvatarInitial(user.userName)}</AvatarFallback>
        </Avatar>
        <div className="-space-y-0.5">
          <h2 className="text-base">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-xs text-gray-500">{user.userName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <form
        action={async () => {
          setUser(null);
          await logout();
        }}
      >
        <Button
          type="submit"
          variant="ghost"
          mode="icon"
          radius="full"
          className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-500"
        >
          <LogOut />
        </Button>
      </form>
    </div>
  );
};

export default CurrentUserCard;
