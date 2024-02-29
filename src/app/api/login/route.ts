import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/server/service";

interface Identifier {
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  const identifier = (await req.json()) as Identifier;
  const { username, password } = identifier;

  try {
    const session = await userService.login(username, password);

    const res = NextResponse.json({}, { status: 200 });
    res.cookies.set("user", `${session.userId}:${session.token}`, {
      expires: session.expired,
      maxAge: 31536000,
    });
    return res;
  } catch (err: any) {
    const res = NextResponse.json({ error: err.message }, { status: 400 });
    return res;
  }
}
