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
  return cookieStore.get("token")?.value;
};
