import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
} from "../../lib/auth";
import { PrismaClient, User } from "@prisma/client";

export type UpdateUserProps = Partial<
  Omit<User, "id" | "created" | "passwordSalt" | "hashedPassword">
>;

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

    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);

    const newUser = await this.db.user.create({
      data: {
        id: id,
        passwordSalt: salt,
        hashedPassword: hashedPassword,
        sessions: {
          create: {
            expired: d,
            token: generateSessionToken(),
          },
        },
      },
      include: {
        sessions: true,
      },
    });

    return { user: newUser, session: newUser.sessions[0] };
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

  async getUserByToken(id: string, token: string) {
    const session = await this.db.userSession.findFirst({
      where: {
        AND: [
          {
            token: token,
          },
          {
            expired: {
              gt: new Date(),
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
    if (!session) {
      return undefined;
    }

    return session.user;
  }

  async logout(id: string, token: string) {
    const user = await this.getUserByToken(id, token);
    if (!user) {
      return;
    }

    const sessions = await this.db.userSession.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return sessions.count;
  }

  async updateUser(id: string, props: UpdateUserProps) {
    const user = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new Error("user does not exist");
    }

    const data = Object.entries(props).reduce((acc, [key, value]) => {
      if (value !== null) {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as UpdateUserProps);

    console.log("updateUser", data);

    const updatedUser = await this.db.user.update({
      where: {
        id: user.id,
      },
      data: data,
    });

    return updatedUser;
  }
}
