import { getToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  chatId: string;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { chatId } = await context.params;

  const searchParams = req.nextUrl.searchParams;
  const pageNumber = searchParams.get("pageNumber") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "20";

  const token = await getToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/chats/${chatId}/messages?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { message: errorText || "Failed to fetch messages" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Message history proxy error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
