import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/server/service";
import { User } from "@prisma/client";

interface Identifier {
  username: string;
  password: string;
}

type ResponseUser = Omit<
  User,
  "passwordSalt" | "hashedPassword" | "email" | "created"
> & {
  created: number;
};

export async function POST(req: NextRequest) {
  const identifier = (await req.json()) as Identifier;
  const { username, password } = identifier;

  try {
    const newUser = await userService.resisterUser(username, password);
    const resUser: ResponseUser = {
      id: newUser.id,
      about: newUser.about,
      created: newUser.created.getTime(),
      karma: newUser.karma,
      submitted: newUser.submitted,
    };
    console.log(resUser);
    const res = NextResponse.json({ user: resUser }, { status: 200 });
    return res;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
