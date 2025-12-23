"use server";

import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function startPrivateChat(username: string) {
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.API_URL}/Chats/private`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetUserName: username }),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    const message = error.error.message;

    console.log(message);

    throw new Error(message);
  }

  revalidatePath("/");
}
