"use client";

import { useRouter } from "next/navigation";
import { favorite, unfavorite } from "@/app/actions";
import { MouseEvent } from "react";

interface Props {
  userId: string | undefined;
  itemId: number;
  favorited: boolean;
  setFavorited: (v: boolean) => void;
}

export const FavoriteTextButton = ({
  userId,
  itemId,
  favorited,
  setFavorited,
}: Props) => {
  const router = useRouter();

  const onClick = async (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();

    if (!userId) {
      router.push("/login");
      return;
    }

    if (!favorited) {
      const result = await favorite(userId, itemId);
      if (!result.success) {
        if (
          result.message &&
          (result.message === "invalid token" ||
            result.message === "unauthorized user")
        ) {
          router.push("/login");
          return;
        }
      } else {
        setFavorited(true);
      }
    } else {
      const result = await unfavorite(userId, itemId);
      if (!result.success) {
        if (
          result.message &&
          (result.message === "invalid token" ||
            result.message === "unauthorized user")
        ) {
          router.push("/login");
          return;
        }
      } else {
        setFavorited(false);
      }
    }
  };

  return (
    <a className="hover:underline cursor-pointer" onClick={onClick}>
      {favorited ? "un-favorite" : "favorite"}
    </a>
  );
};
