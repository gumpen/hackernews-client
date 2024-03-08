import { Item } from "@prisma/client";

export interface User {
  id: string;
  about: string | null;
  created: Date;
  karma: number;
  submitted: number[];
}

export interface ItemWithKids extends Item {
  kids?: Item[];
}

export interface ItemWithDescendants extends Item {
  descendants?: Item[];
}
