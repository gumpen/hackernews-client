"use client";

import { upvote } from "@/app/actions";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  userId: string | undefined;
  itemId: number;
  voted: boolean;
  setVoted: (v: boolean) => void;
}

export const UpvoteButton = ({ userId, itemId, voted, setVoted }: Props) => {
  const router = useRouter();

  const onClick = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const result = await upvote(userId, itemId);
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
      setVoted(true);
    }
  };

  return (
    <div className="w-3 h-3 mx-1">
      <button
        className={classNames("align-top", { invisible: voted })}
        onClick={onClick}
      >
        <img src="triangle.svg" width={10} height={10} />
      </button>
    </div>
  );
};
