import { PrismaClient, Item, type Prisma } from "@prisma/client";

export class ItemService {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  createStory = async ({
    userId,
    title,
    url,
    text,
  }: {
    userId: string;
    title: string;
    url: string | null;
    text: string | null;
  }) => {
    const item = await this.db.item.create({
      data: {
        type: "story",
        userId: userId,
        title: title,
        url: url,
        text: text,
      },
    });

    return item;
  };

  getItem = async (id: number) => {
    const item = await this.db.item.findUnique({
      where: {
        id: id,
      },
      include: {
        kids: true,
        descendants: true,
      },
    });

    return item;
  };

  createComment = async ({
    userId,
    parentId,
    ancestorId,
    text,
  }: {
    userId: string;
    parentId: number;
    ancestorId: number;
    text: string;
  }) => {
    console.log(userId);
    console.log(parentId);
    console.log(ancestorId);
    const item = await this.db.item.create({
      data: {
        type: "comment",
        userId: userId,
        parentId: parentId,
        ancestorId: ancestorId,
        text: text,
      },
    });

    return item;
  };

  getStories = async (page: number, perPage: number) => {
    const items = await this.db.item.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: {
        type: "story",
      },
      include: {
        descendants: true,
        _count: {
          select: {
            upvotedUsers: true,
          },
        },
      },
      orderBy: {
        upvotedUsers: {
          _count: "desc",
        },
      },
    });

    return items;
  };

  getUpvotedSubmissionsByUserId = async (userId: string) => {
    const items = await this.db.item.findMany({
      where: {
        AND: [
          { type: "story" },
          { upvotedUsers: { some: { userId: userId } } },
        ],
      },
      include: {
        descendants: true,
      },
    });

    return items;
  };

  getUpvotedCommentsByUserId = async (userId: string) => {
    const items = await this.db.item.findMany({
      where: {
        AND: [
          { type: "comment" },
          { upvotedUsers: { some: { userId: userId } } },
        ],
      },
      include: {
        ancestor: true,
      },
    });

    return items;
  };

  getFavoritedSubmissionsByUserId = async (userId: string) => {
    const items = await this.db.item.findMany({
      where: {
        AND: [
          { type: "story" },
          { favoritedUsers: { some: { userId: userId } } },
        ],
      },
      include: {
        descendants: true,
      },
    });

    return items;
  };

  getFavoritedCommentsByUserId = async (userId: string) => {
    const items = await this.db.item.findMany({
      where: {
        AND: [
          { type: "comment" },
          { favoritedUsers: { some: { userId: userId } } },
        ],
      },
      include: {
        ancestor: true,
      },
    });

    return items;
  };
}
