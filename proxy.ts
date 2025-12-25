import { NextRequest, NextResponse } from "next/server";
import { getToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const token = await getToken();
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register"];

  const isPublic = publicRoutes.some((route) => {
    pathname.startsWith(route);
  });

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // If logged in & tries to access login → redirect home
  if (token && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
