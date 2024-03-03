import { User } from "@prisma/client";

export type ResponseUser = Omit<
  User,
  "passwordSalt" | "hashedPassword" | "email" | "created"
> & {
  created: number;
};
