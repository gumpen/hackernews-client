import { Item as PrismaItem, User as PrismaUser } from "@prisma/client";

export interface User extends PrismaUser {
  items?: {
    type: string;
  }[];
  upvotedItems?: {
    itemId: number;
  }[];
  favoriteItems?: {
    itemId: number;
  }[];
  karma: number;
}

export interface AppUser {
  id: string;
  about: string;
  created: Date;
  email: string;
  submitted: number[];
  upvotedItems: number[];
  favoriteItems: number[];
  karma: number;
}

export interface Item extends PrismaItem {
  kids?: ItemWithKids[];
  descendants?: Item[];
  ancestor?: Item | null;
  _count?: {
    upvotedUsers?: number;
  };
}

export interface ItemWithKids extends PrismaItem {
  kids?: ItemWithKids[];
}

export interface ItemWithDescendants extends PrismaItem {
  descendants?: Item[];
}

export interface ItemWithAncestor extends PrismaItem {
  ancestor: Item | null;
}
