"use client";

import { convertNumberToTimeAgo, toHostname } from "@/lib/util";
import { ItemWithDescendants, User } from "@/lib/definitions";
import Link from "next/link";
import { UpvoteButton } from "./upvote-button";
import { UnvoteTextButton } from "./unvote-text-button";
import { useState } from "react";

interface Props {
  item: ItemWithDescendants;
  index: number;
  voted: boolean;
  user: User | undefined;
}

export const NewsItem = ({ item, index, voted: initialVoted, user }: Props) => {
  const [voted, setVoted] = useState(initialVoted);

  return (
    <>
      <tr key={`${item.id}-title-row`}>
        <td
          className="text-sm pt-0.5"
          style={{ textAlign: "right", verticalAlign: "top" }}
        >
          <span className="text-content-gray">{`${index + 1}.`}</span>
        </td>
        <td className="pt-1.5 align-top">
          <UpvoteButton
            userId={user?.id}
            itemId={item.id}
            voted={voted}
            setVoted={setVoted}
          ></UpvoteButton>
        </td>
        <td>
          <span className="text-sm">
            <a href={item.url ?? ""} target="_blank">
              {item.title}
            </a>
          </span>
          <span className="text-2xs text-content-gray">{` (${toHostname(item.url ?? "")})`}</span>
        </td>
      </tr>
      <tr className="h-1" key={`${item.id}-detail-row`}>
        <td colSpan={2} />
        <td className="text-3xs">
          <span className="text-content-gray">
            <span>n points</span>{" "}
            <Link className="hover:underline" href={`/user?id=${item.userId}`}>
              by {item.userId}
            </Link>{" "}
            <Link className="hover:underline" href={`/item?id=${item.id}`}>
              {convertNumberToTimeAgo(item.created.getTime())}
            </Link>
            {voted ? (
              <>
                {" | "}
                <UnvoteTextButton
                  userId={user?.id}
                  itemId={item.id}
                  setVoted={setVoted}
                ></UnvoteTextButton>
              </>
            ) : (
              <></>
            )}
            {" | "}
            <span>hide</span>
            {" | "}
            <Link className="hover:underline" href={`/item?id=${item.id}`}>
              {item.descendants?.length ?? 0} comments
            </Link>
          </span>
        </td>
      </tr>
    </>
  );
};
