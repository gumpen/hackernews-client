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

  isThreadRootComment = async ({
    userId,
    parentId,
    ancestorId,
  }: {
    userId: string;
    parentId: number;
    ancestorId: number;
  }) => {
    const story = await this.db.item.findUnique({
      where: {
        id: ancestorId,
      },
      include: {
        descendants: {
          select: {
            id: true,
            userId: true,
            parentId: true,
          },
        },
      },
    });
    if (!story) {
      throw new Error("invalid ancestorId");
    }

    let parent = story.descendants.find((item) => item.id === parentId);
    if (!parent) {
      return true;
    }

    while (parent.parentId !== story.id) {
      if (parent.userId === userId) {
        return false;
      }

      const newParent = story.descendants.find(
        (item) => item.id === parent?.parentId
      );
      if (!newParent) {
        return true;
      }

      parent = newParent;
    }

    return true;
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
    const isThreadRoot = await this.isThreadRootComment({
      userId,
      parentId,
      ancestorId,
    });

    const item = await this.db.item.create({
      data: {
        type: "comment",
        userId: userId,
        parentId: parentId,
        ancestorId: ancestorId,
        text: text,
        isThreadRoot: isThreadRoot,
      },
    });

    return item;
  };

  getStories = async (page: number, perPage: number) => {
    const where: Prisma.ItemWhereInput = {
      AND: [
        {
          type: "story",
        },
        {
          url: {
            not: null,
          },
        },
        {
          url: {
            not: "",
          },
        },
      ],
    };

    const items = await this.db.item.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: where,
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

    const count = await this.db.item.count({
      where: where,
    });

    return { stories: items, totalCount: count };
  };

  getUpvotedSubmissionsByUserId = async (
    userId: string,
    page: number,
    perPage: number
  ) => {
    const where: Prisma.UpvotesOnItemsWhereInput = {
      AND: [
        {
          userId: userId,
        },
        {
          item: {
            type: "story",
          },
        },
      ],
    };

    const relations = await this.db.upvotesOnItems.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: where,
      include: {
        item: {
          include: {
            ancestor: true,
          },
        },
      },
      orderBy: {
        created: "desc",
      },
    });

    const items = relations.map((r) => r.item);
    const count = await this.db.upvotesOnItems.count({ where: where });

    return { items, totalCount: count };
  };

  getUpvotedCommentsByUserId = async (
    userId: string,
    page: number,
    perPage: number
  ) => {
    const where: Prisma.UpvotesOnItemsWhereInput = {
      AND: [
        {
          userId: userId,
        },
        {
          item: {
            type: "comment",
          },
        },
      ],
    };

    const relations = await this.db.upvotesOnItems.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: where,
      include: {
        item: {
          include: {
            ancestor: true,
          },
        },
      },
      orderBy: {
        created: "desc",
      },
    });

    const items = relations.map((r) => r.item);
    const count = await this.db.upvotesOnItems.count({ where: where });

    return { items, totalCount: count };
  };

  getFavoritedSubmissionsByUserId = async (
    userId: string,
    page: number,
    perPage: number
  ) => {
    const where: Prisma.FavoritesOnItemsWhereInput = {
      AND: [
        {
          userId: userId,
        },
        {
          item: {
            type: "story",
          },
        },
      ],
    };

    const relations = await this.db.favoritesOnItems.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: where,
      include: {
        item: {
          include: {
            descendants: true,
          },
        },
      },
      orderBy: {
        created: "desc",
      },
    });

    const items = relations.map((r) => r.item);
    const count = await this.db.favoritesOnItems.count({ where: where });

    return { items, totalCount: count };
  };

  getFavoritedCommentsByUserId = async (
    userId: string,
    page: number,
    perPage: number
  ) => {
    const where: Prisma.FavoritesOnItemsWhereInput = {
      AND: [
        {
          userId: userId,
        },
        {
          item: {
            type: "comment",
          },
        },
      ],
    };

    const relations = await this.db.favoritesOnItems.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: where,
      include: {
        item: {
          include: {
            ancestor: true,
          },
        },
      },
      orderBy: {
        created: "desc",
      },
    });

    const items = relations.map((r) => r.item);
    const count = await this.db.favoritesOnItems.count({ where: where });

    return { items, totalCount: count };
  };

  getUserThreads = async (userId: string, page: number, perPage: number) => {
    const where: Prisma.ItemWhereInput = {
      AND: [
        {
          type: "comment",
        },
        {
          userId: userId,
        },
        {
          isThreadRoot: true,
        },
      ],
    };

    const threadRootComments = await this.db.item.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: where,
      orderBy: [
        {
          created: "desc",
        },
        { id: "desc" },
      ],
    });

    const totalCount = await this.db.item.count({ where: where });

    const ancestorIds = threadRootComments.reduce((acc, v) => {
      if (v.ancestorId) {
        acc.push(v.ancestorId);
      }
      return acc;
    }, [] as number[]);
    const uniqAncestorIds = Array.from(new Set(ancestorIds));

    const stories = await this.db.item.findMany({
      where: {
        AND: [
          {
            id: {
              in: uniqAncestorIds,
            },
          },
        ],
      },
      include: {
        descendants: true,
      },
    });

    const threads = threadRootComments.map((comment) => {
      const story = stories.find((s) => s.id === comment.ancestorId);
      if (!story) {
        throw new Error("invalid ancestorId");
      }

      const threadComments = [comment];
      this.getCommentsInThread(story.descendants, comment, threadComments);

      return {
        story: {
          id: story.id,
          title: story.title,
        },
        threadRootCommentId: comment.id,
        comments: threadComments,
      };
    });

    // threadRootCommentsの要素ごとに、storyをひき、story.descendantsからその要素を取得
    // その要素のidをparentIdとする要素を全取得してparentIdが取れなくなるまで再帰
    // 都度とれたitemは配列に格納

    return { threads, totalCount };
  };

  private getCommentsInThread = (
    allComments: Item[],
    cursor: Item,
    resComments: Item[]
  ) => {
    const kids = allComments.filter((c) => c.parentId === cursor.id);
    if (kids.length === 0) {
      return;
    }

    resComments.push(...kids);

    kids.map((kc) => {
      this.getCommentsInThread(allComments, kc, resComments);
    });

    return;
  };

  getAskStories = async (page: number, perPage: number) => {
    const where: Prisma.ItemWhereInput = {
      AND: [
        {
          type: "story",
        },
        {
          OR: [
            {
              url: null,
            },
            {
              url: "",
            },
          ],
        },
      ],
    };

    const items = await this.db.item.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: where,
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

    const count = await this.db.item.count({
      where: where,
    });

    return { items, totalCount: count };
  };
}
