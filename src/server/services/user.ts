import { hashPassword, verifyPassword } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";
import { generateSessionToken } from "../../lib/auth";

export class UserService {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getUser(id: string) {
    // return this.db.getUser(id);
    const user = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }

  async resisterUser(id: string, password: string) {
    // validation
    if (id.length < 3 || id.length > 64) {
      throw new Error("user id length is invalid");
    }

    if (password.length < 8 || password.length > 128) {
      throw new Error("user password length is invalid");
    }

    const user = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user) {
      throw new Error("user id is already taken");
    }

    const { salt, hashedPassword } = hashPassword(password);

    const newUser = await this.db.user.create({
      data: {
        id: id,
        passwordSalt: salt,
        hashedPassword: hashedPassword,
      },
    });

    return newUser;
  }

  async createSession(userId: string) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("user does not exist");
    }

    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);

    const session = await this.db.userSession.create({
      data: {
        userId: userId,
        expired: d,
        token: generateSessionToken(),
      },
    });

    return session;
  }

  async login(id: string, password: string) {
    const user = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new Error("user does not exist");
    }

    if (!verifyPassword(password, user.passwordSalt, user.hashedPassword)) {
      throw new Error("invalid credential");
    }

    return this.createSession(user.id);
  }
}
