import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/server/service";
import { cookies } from "next/headers";
import { ResponseUser } from "@/server/types";

export async function GET(req: NextRequest) {
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

  const user = await userService.getUserByToken(username, token);
  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }
  const resUser: ResponseUser = {
    id: user.id,
    about: user.about,
    created: user.created.getTime(),
    karma: user.karma,
    submitted: user.submitted,
  };
  return NextResponse.json({ user: resUser }, { status: 200 });
}
