import fs from "fs";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { z } from "zod";
import { randomBytes, scryptSync } from "crypto";
import { ItemWithKids } from "@/lib/definitions";

const users = require("./data/users.json");
const jsonItems = require("./data/items.json");

const prisma = new PrismaClient();

function createRandomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function hashPassword(password: string): {
  salt: string;
  hashedPassword: string;
} {
  const salt = randomBytes(16).toString("hex");

  const hashedPassword = scryptSync(password, salt, 64).toString("hex");

  return { salt, hashedPassword };
}

async function createItems(
  items: ItemWithKids[],
  parentId: number | null = null,
  ancestorId: number | null = null
) {
  items.map(async (item) => {
    let isThreadRoot = false;
    if (parentId && ancestorId) {
      isThreadRoot = await isThreadRootComment({
        userId: item.userId,
        parentId,
        ancestorId,
      });
    }

    const resItem = await prisma.item.create({
      data: {
        type: item.type,
        userId: item.userId,
        text: item.text,
        url: item.url,
        title: item.title,
        parentId: parentId,
        ancestorId: ancestorId,
        isThreadRoot: isThreadRoot,
      },
    });
    // console.log(resItem.id);
    if (item.kids && item.kids.length > 0) {
      await createItems(
        item.kids,
        resItem.id,
        item.type === "story" ? resItem.id : ancestorId
      );
    }
  });
}

async function isThreadRootComment({
  userId,
  parentId,
  ancestorId,
}: {
  userId: string;
  parentId: number;
  ancestorId: number;
}) {
  const story = await prisma.item.findUnique({
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
}

async function main() {
  console.log("Seeding started...");

  console.info("Seeding users");

  await prisma.user.createMany({
    data: users.data.map((user: any) => {
      const pass = createRandomString(8);
      const { salt, hashedPassword } = hashPassword(pass);
      console.log(`user ${user.id}'s password:`, pass);
      return {
        id: user.id,
        about: user.about,
        email: user.email,
        passwordSalt: salt,
        hashedPassword: hashedPassword,
      };
    }),
    skipDuplicates: true,
  });

  console.info("Seeding items");

  await createItems(jsonItems.data);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
