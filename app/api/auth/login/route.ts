import { getPFP, storeToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.API_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.errors }, { status: 400 });
    }

    await storeToken(data.token);

    const pfp = await getPFP(data.token);

    return NextResponse.json({
      success: true,
      user: { ...data.user, avatar: pfp },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
