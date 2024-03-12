"use client";

import { ReplyCommentActionState, replyComment } from "@/app/actions";
import { Item } from "@prisma/client";
import { useFormState } from "react-dom";
import { convertNumberToTimeAgo } from "@/lib/util";
import Link from "next/link";
import { CommentInputForm } from "./comment-input-form";
import { User } from "@/lib/definitions";
import { useState } from "react";
import { UpvoteButton } from "./upvote-button";
import { UnvoteTextButton } from "./unvote-text-button";

interface Props {
  item: Item;
  ancestorItem: Item;
  user: User | null;
}

export const CommentForm = ({ item, ancestorItem, user }: Props) => {
  const userUpvotedItemIds = () => {
    if (user && user.upvotedItems) {
      return user.upvotedItems.map((relation) => relation.itemId);
    } else {
      return [];
    }
  };

  const [voted, setVoted] = useState(userUpvotedItemIds().includes(item.id));

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
              <span>{item.userId} </span>
              <span>{convertNumberToTimeAgo(item.created.getTime())}</span>
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
              <span>parent</span>
              {" | "}
              <span>context</span>
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
            ></CommentInputForm>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
