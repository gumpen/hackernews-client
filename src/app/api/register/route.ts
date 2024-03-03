import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/server/service";
import { User } from "@prisma/client";

type ResponseUser = Omit<
  User,
  "passwordSalt" | "hashedPassword" | "email" | "created"
> & {
  created: number;
};

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const username = data.get("username");
  const password = data.get("password");
  if (!username || !password) {
    return NextResponse.json({}, { status: 400 });
  }

  try {
    const { user, session } = await userService.resisterUser(
      username.toString(),
      password.toString()
    );
    const resUser: ResponseUser = {
      id: user.id,
      about: user.about,
      created: user.created.getTime(),
      karma: user.karma,
      submitted: user.submitted,
    };

    const res = NextResponse.redirect("http://localhost:3000/");
    if (session) {
      res.cookies.set("user", `${session.userId}:${session.token}`, {
        expires: session.expired,
        maxAge: 31536000,
      });
    }
    return res;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
