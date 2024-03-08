import { splitToken } from "@/lib/util";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("middleware");

  const tokenCookie = request.cookies.get("user");
  if (!tokenCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { username, token } = splitToken(tokenCookie?.value);
  if (!username || !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // MEMO: Nextにおけるmiddlewareはedge runtimeで動作しているようで通常のprismaは使えないため、cookieの存在確認にとどめる
  // err => Error: PrismaClient is unable to run in Vercel Edge Functions or Edge Middleware
  // const user = await userService.getUserByToken(username, token);
  // if (!user) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/submit", "/reply"],
};
