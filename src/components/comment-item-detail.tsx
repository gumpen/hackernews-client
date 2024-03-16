"use client";

import { Item } from "@prisma/client";
import { convertNumberToTimeAgo } from "@/lib/util";
import { ReplyCommentActionState, replyComment } from "@/app/actions";
import { useFormState } from "react-dom";
import { ItemWithKids } from "@/lib/definitions";
import Link from "next/link";
import { CommentInputForm } from "./comment-input-form";
import { UpvoteButton } from "./upvote-button";
import { UnvoteTextButton } from "./unvote-text-button";
import { AppUser } from "@/lib/definitions";
import { useState } from "react";
import { FavoriteTextButton } from "./favorite-text-button";

interface Props {
  item: ItemWithKids;
  ancestorItem: Item;
  user: AppUser | null;
}

export const CommentItemDetail = ({ item, ancestorItem, user }: Props) => {
  const [voted, setVoted] = useState(
    user?.upvotedItems.includes(item.id) || false
  );
  const [favorited, setFavorited] = useState(
    user?.favoriteItems.includes(item.id) || false
  );

  const [formState, formDispatch] = useFormState(
    replyComment,
    {} as ReplyCommentActionState
  );

  return (
    <table className="border-separate">
      <tbody>
        <tr>
          <td
            className="text-sm pt-1"
            style={{ textAlign: "right", verticalAlign: "top" }}
          ></td>
          <td className="pt-0.5 align-top">
            <UpvoteButton
              userId={user?.id}
              itemId={item.id}
              voted={voted}
              setVoted={setVoted}
            ></UpvoteButton>
          </td>
          <td className="text-2xs">
            <span className="text-content-gray">
              <Link
                className="hover:underline"
                href={`/user?id=${item.userId}`}
              >
                {item.userId}
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
              <Link
                className="hover:underline"
                href={`/item?id=${item.parentId}`}
              >
                parent
              </Link>
              {" | "}
              <span>context</span>
              {" | "}
              <FavoriteTextButton
                userId={user?.id}
                itemId={item.id}
                favorited={favorited}
                setFavorited={setFavorited}
              ></FavoriteTextButton>
              {" | "}
              <span>on: </span>
              <Link
                className="hover:underline"
                href={`/item?id=${ancestorItem.id}`}
              >
                {ancestorItem.title}
              </Link>
            </span>
          </td>
        </tr>
        <tr className="h-1">
          <td colSpan={2} />
          <td className="text-xs">
            <span>{item.text}</span>
          </td>
        </tr>
        <tr className="h-2.5"></tr>
        <tr>
          <td colSpan={2} />
          <td>
            <CommentInputForm
              formAction={formDispatch}
              parentId={item.id}
              ancestorId={ancestorItem.id}
              submitTitle="reply"
              goto={`/item?id=${item.id}`}
            ></CommentInputForm>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
