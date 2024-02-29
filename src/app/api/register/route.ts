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
    const newUser = userService.resisterUser(username, password);
    const res = NextResponse.json({ user: newUser }, { status: 200 });
    return res;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
