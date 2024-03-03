import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/server/service";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const username = data.get("username");
  const password = data.get("password");
  if (!username || !password) {
    return NextResponse.json({}, { status: 400 });
  }

  try {
    const session = await userService.login(
      username.toString(),
      password.toString()
    );

    const res = NextResponse.redirect("http://localhost:3000/");
    res.cookies.set("user", `${session.userId}:${session.token}`, {
      expires: session.expired,
      maxAge: 31536000,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
