"use server";

import { User } from "@/lib/definitions";
import { splitToken } from "@/lib/util";
import { userService, itemService } from "@/server/service";
import { cookies } from "next/headers";
import { Item } from "@prisma/client";
import { redirect } from "next/navigation";

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

export interface PostStoryActionState {
  item?: Item;
  success: boolean;
  message?: string;
}

export async function postStory(
  state: PostStoryActionState,
  form: FormData
): Promise<PostStoryActionState> {
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
  const currentUser = await userService.getUserByToken(username, token);
  if (!currentUser) {
    return {
      success: false,
      message: "unauthorized user",
    };
  }

  const title = form.get("title");
  const url = form.get("url");
  const text = form.get("text");

  // TODO: もっと詳細なバリデーション
  // validation
  if (!title || !title.toString()) {
    return {
      success: false,
      message: "invalid params",
    };
  }

  const payload = {
    userId: currentUser.id,
    title: title.toString(),
    url: url?.toString() || null,
    text: text?.toString() || null,
  };

  const item = await itemService.createStory(payload);

  redirect(`/item?id=${item.id}`);
  // return {
  //   item: item,
  //   success: true,
  // };
}
