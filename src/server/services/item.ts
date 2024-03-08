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
}
