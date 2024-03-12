"use client";

import { useRouter } from "next/navigation";
import { unvote } from "@/app/actions";
import { MouseEvent } from "react";

interface Props {
  userId: string | undefined;
  itemId: number;
  setVoted: (v: boolean) => void;
}

export const UnvoteTextButton = ({ userId, itemId, setVoted }: Props) => {
  const router = useRouter();

  const onClick = async (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();

    if (!userId) {
      router.push("/login");
      return;
    }

    const result = await unvote(userId, itemId);
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
      setVoted(false);
    }
  };

  return (
    <a className="hover:underline cursor-pointer" onClick={onClick}>
      unvote
    </a>
  );
};
