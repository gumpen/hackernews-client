import { cookies } from "next/headers";
import { userService } from "../server/service";

export const getCurrentUser = async () => {
  const cookieStore = cookies();
  const userString = cookieStore.get("user");
  if (!userString) {
    return undefined;
  }
  const split = userString.value.split(":");
  const username = split[0];
  const token = split[1];
  if (!username || !token) {
    return undefined;
  }

  const user = await userService.getUserByToken(username, token);
  return user;
};
