import { Item, User as PrismaUser } from "@prisma/client";

export interface User extends PrismaUser {
  upvotedItems?: {
    itemId: number;
  }[];
  favoriteItems?: {
    itemId: number;
  }[];
}

export interface ItemWithKids extends Item {
  kids?: ItemWithKids[];
}

export interface ItemWithDescendants extends Item {
  descendants?: Item[];
}

export interface ItemWithAncestor extends Item {
  ancestor: Item | null;
}
