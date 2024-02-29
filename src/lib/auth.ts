import { randomBytes, scryptSync } from "crypto";

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
