import { cache } from "react";
import { cookies } from "next/headers";
import { userService } from "../server/service";

export const getCurrentUser = cache(async () => originalGetCurrentUser());

export const originalGetCurrentUser = async () => {
  const cookieStore = cookies();
  const userString = cookieStore.get("user");
  if (!userString) {
    return null;
  }
  const split = userString.value.split(":");
  const username = split[0];
  const token = split[1];
  if (!username || !token) {
    return null;
  }

  const user = await userService.getUserByToken(username, token);
  return user;
};

export const getUserById = async (id: string) => {
  const user = await userService.getUser(id);
  return user;
};
