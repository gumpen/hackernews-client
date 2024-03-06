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
}
