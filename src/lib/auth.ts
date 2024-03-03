import { randomBytes, scryptSync } from "crypto";

// import { cookies } from "next/headers";
// import { userService } from "../server/service";

export const hashPassword = (
  password: string
): { salt: string; hashedPassword: string } => {
  const salt = randomBytes(16).toString("hex");

  const hashedPassword = scryptSync(password, salt, 64).toString("hex");

  return { salt, hashedPassword };
};

export const verifyPassword = (
  password: string,
  salt: string,
  hashedPassword: string
): boolean => {
  const h = scryptSync(password, salt, 64).toString("hex");
  return h === hashedPassword;
};

export const generateSessionToken = (): string => {
  return randomBytes(16).toString("hex");
};

// // MEMO: ここに定義してpageから呼び出すとエラーになる
// // Error: Invariant: AsyncLocalStorage accessed in runtime where it is not available
// export const getCurrentUser = async () => {
//   console.log("getCurrentUser");
//   const cookieStore = cookies();
//   const userString = cookieStore.get("user");
//   if (!userString) {
//     return undefined;
//   }
//   const split = userString.value.split(":");
//   const username = split[0];
//   const token = split[1];
//   if (!username || !token) {
//     return undefined;
//   }

//   const user = await userService.getUserByToken(username, token);
//   return user;
// };
