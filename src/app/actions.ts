"use server";

import { User } from "@/lib/definitions";
import { splitToken } from "@/lib/util";
import { userService } from "@/server/service";
import { cookies } from "next/headers";

export interface UpdateUserActionState {
  user?: User;
  success: boolean;
  message?: string;
}

export async function updateUser(
  state: UpdateUserActionState,
  form: FormData
): Promise<UpdateUserActionState> {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user");
  if (!userCookie) {
    return {
      success: false,
      message: "invalid token",
    };
  }

  const { username, token } = splitToken(userCookie.value);
  if (!username || !token) {
    return {
      success: false,
      message: "invalid token",
    };
  }

  const id = form.get("id");
  if (!id) {
    return {
      success: false,
      message: "invalid user id",
    };
  }

  const currentUser = await userService.getUserByToken(username, token);
  if (!currentUser || id !== currentUser.id) {
    return {
      success: false,
      message: "unauthorized user",
    };
  }

  const about = form.get("about")?.toString() || "";
  const email = form.get("email")?.toString() || "";

  try {
    const user = await userService.updateUser(id.toString(), { about, email });
    return {
      user: user,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "failed to update",
    };
  }
}
