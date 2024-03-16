import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
} from "../../lib/auth";
import { PrismaClient, User as PrismaUser, Prisma } from "@prisma/client";
import { AppUser } from "@/lib/definitions";

interface PrismaUserWithRelations extends PrismaUser {
  items: {
    id: number;
    type: string;
  }[];
  upvotedItems: {
    itemId: number;
  }[];
  favoriteItems: {
    itemId: number;
  }[];
}

export type UpdateUserProps = Partial<
  Omit<PrismaUser, "id" | "created" | "passwordSalt" | "hashedPassword">
>;

export class UserService {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  mapToAppUser(dbUser: PrismaUserWithRelations): AppUser {
    const user: AppUser = {
      id: dbUser.id,
      about: dbUser.about || "",
      created: dbUser.created,
      submitted: dbUser.items.map((item) => item.id),
      email: dbUser.email || "",
      upvotedItems: dbUser.upvotedItems.map((relation) => relation.itemId),
      favoriteItems: dbUser.favoriteItems.map((relation) => relation.itemId),
      karma: dbUser.items.reduce((count, item) => {
        return count + (item.type === "story" ? 5 : 1);
      }, 1),
    };

    return user;
  }

  async getUser(id: string) {
    const dbUser = await this.db.user.findUnique({
      where: {
        id: id,
      },
      include: {
        items: {
          select: {
            id: true,
            type: true,
          },
        },
        upvotedItems: {
          select: {
            itemId: true,
          },
        },
        favoriteItems: {
          select: {
            itemId: true,
          },
        },
      },
    });

    if (!dbUser) {
      return null;
    }

    const user = this.mapToAppUser(dbUser);

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

  async getUserByToken(id: string, token: string): Promise<AppUser | null> {
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
        user: {
          include: {
            items: {
              select: {
                id: true,
                type: true,
              },
            },
            upvotedItems: {
              select: {
                itemId: true,
              },
            },
            favoriteItems: {
              select: {
                itemId: true,
              },
            },
          },
        },
      },
    });
    if (!session) {
      return null;
    }

    const dbUser = session.user;
    const user = this.mapToAppUser(dbUser);

    return user;
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

    const updatedDbUser = await this.db.user.update({
      where: {
        id: user.id,
      },
      data: data,
      include: {
        items: {
          select: {
            id: true,
            type: true,
          },
        },
        upvotedItems: {
          select: {
            itemId: true,
          },
        },
        favoriteItems: {
          select: {
            itemId: true,
          },
        },
      },
    });

    const resUser = this.mapToAppUser(updatedDbUser);

    return resUser;
  }

  async upvoteItem(userId: string, itemId: number) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("user does not exist");
    }

    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        upvotedItems: {
          create: {
            item: {
              connect: {
                id: itemId,
              },
            },
          },
        },
      },
    });

    return updatedUser;
  }

  async unvoteItem(userId: string, itemId: number) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("user does not exist");
    }

    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        upvotedItems: {
          delete: {
            itemId_userId: {
              itemId: itemId,
              userId: userId,
            },
          },
        },
      },
    });

    return updatedUser;
  }

  async favoriteItem(userId: string, itemId: number) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("user does not exist");
    }

    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteItems: {
          create: {
            item: {
              connect: {
                id: itemId,
              },
            },
          },
        },
      },
    });

    return updatedUser;
  }

  async unfavoriteItem(userId: string, itemId: number) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("user does not exist");
    }

    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteItems: {
          delete: {
            itemId_userId: {
              itemId: itemId,
              userId: userId,
            },
          },
        },
      },
    });

    return updatedUser;
  }
}
