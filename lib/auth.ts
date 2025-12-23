import { IUser } from "@/types/user.type";
import { cookies } from "next/headers";

export const storeToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
};

export const getCurrentUser = async () => {
  try {
    const token = await getToken();
    if (!token) return null;

    const response = await fetch(`${process.env.API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const user = await response.json();

    const pfp = await getPFP(token);

    return {
      ...user,
      avatar: pfp,
    } as IUser;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getPFP = async (token: string) => {
  const res = await fetch(`${process.env.API_URL}/image/profile-picture`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();

  return data.url ?? null;
};

export const getUserAvatar = async (username: string) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("Missing auth token");
    }

    const res = await fetch(
      `${process.env.API_URL}/image/profile-picture/${username}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};
