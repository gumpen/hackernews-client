"use client";

import { UpvoteButton } from "./upvote-button";
import { UnvoteTextButton } from "./unvote-text-button";
import Link from "next/link";
import { convertNumberToTimeAgo } from "@/lib/util";
import { ItemWithAncestor } from "@/lib/definitions";
import { useState } from "react";

interface Props {
  item: ItemWithAncestor;
  userId?: string | undefined;
  voted?: boolean;
}

export const CommentItem = ({
  item,
  userId,
  voted: initialVoted = false,
}: Props) => {
  const [voted, setVoted] = useState(initialVoted);
  return (
    <tr key={item.id}>
      <td></td>
      <td className="pt-1.5 align-top">
        <UpvoteButton
          userId={userId}
          itemId={item.id}
          voted={voted}
          setVoted={setVoted}
        ></UpvoteButton>
      </td>
      <td className="text-sm">
        <div className="mt-0.5">
          <span className="text-2xs text-content-gray">
            <Link className="hover:underline" href={`/user?id=${item.userId}`}>
              {item.userId}
            </Link>{" "}
            <Link className="hover:underline" href={`/item?id=${item.id}`}>
              {convertNumberToTimeAgo(item.created.getTime())}
            </Link>
            {voted ? (
              <>
                {" | "}
                <UnvoteTextButton
                  userId={userId}
                  itemId={item.id}
                  setVoted={setVoted}
                ></UnvoteTextButton>
              </>
            ) : (
              <></>
            )}
            {" | "}
            <Link
              className="hover:underline"
              href={`/item?id=${item.parentId}`}
            >
              parent
            </Link>
            {" | "}
            <span>context</span>
            {" | "}
            <span>on: </span>
            <Link
              className="hover:underline"
              href={`/item?id=${item.ancestorId}`}
            >
              {item.ancestor?.title ?? "root"}
            </Link>
          </span>
        </div>
        <div className="text-xs text-black">
          <span>{item.text}</span>
        </div>
      </td>
    </tr>
  );
};
