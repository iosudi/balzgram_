"use client";
import { IUser } from "@/types/user.type";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initUser,
  token,
}: {
  children: React.ReactNode;
  initUser: IUser | null;
  token: string | null;
}) => {
  const [user, setUser] = useState<IUser | null>(initUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
