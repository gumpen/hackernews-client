import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userService } from "@/server/service";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user");
  if (!userCookie) {
    return NextResponse.json({}, { status: 401 });
  }
  const split = userCookie.value.split(":");
  const username = split[0];
  const token = split[1];
  if (!username || !token) {
    return NextResponse.json({}, { status: 401 });
  }

  const cnt = userService.logout(username, token);
  if (cnt === undefined) {
    return NextResponse.json({}, { status: 401 });
  } else {
    return NextResponse.json({}, { status: 200 });
  }
}
