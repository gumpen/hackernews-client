"use client";

import { Item } from "@prisma/client";
import { toHostname, convertNumberToTimeAgo } from "@/lib/util";
import { PostCommentActionState, postComment } from "@/app/actions";
import { useRef, FormEvent, useState } from "react";
import { useFormState } from "react-dom";
import { ItemWithDescendants, User } from "@/lib/definitions";
import { UpvoteButton } from "./upvote-button";
import { UnvoteTextButton } from "./unvote-text-button";
import { CommentInputForm } from "./comment-input-form";

interface Props {
  item: ItemWithDescendants;
  user?: User | null;
}

export const ItemDetail = ({ item, user }: Props) => {
  const userUpvotedItemIds = () => {
    if (user && user.upvotedItems) {
      return user.upvotedItems.map((relation) => relation.itemId);
    } else {
      return [];
    }
  };

  const [voted, setVoted] = useState(userUpvotedItemIds().includes(item.id));
  const ref = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (form: FormData) => {
    const res = await postComment({} as PostCommentActionState, form);
    if (res.success) {
      if (ref.current) {
        ref.current.reset();
      }
    }
  };
  return (
    <table className="border-separate">
      <tbody>
        <tr>
          <td
            className="text-sm pt-1"
            style={{ textAlign: "right", verticalAlign: "top" }}
          ></td>
          <td className="pt-1.5 align-top">
            <UpvoteButton
              userId={user?.id}
              itemId={item.id}
              voted={voted}
              setVoted={setVoted}
            ></UpvoteButton>
          </td>
          <td>
            {item.url ? (
              <>
                <span className="text-sm">
                  <a href={item.url} target="_blank">
                    {item.title}
                  </a>
                </span>
                <span className="text-2xs text-content-gray">{` (${toHostname(item.url)})`}</span>
              </>
            ) : (
              <>
                <span className="text-sm">
                  <a href={`/item?id=${item.id}`} target="_blank">
                    {item.title}
                  </a>
                </span>
              </>
            )}
          </td>
        </tr>
        <tr className="h-1">
          <td colSpan={2} />
          <td className="text-3xs">
            <span className="text-content-gray">
              <span>1 points </span>
              <span>by {item.userId} </span>
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
              <span>hide</span>
              {" | "}
              <span>past</span>
              {" | "}
              <span>favorite</span>
              {" | "}
              <span>{item.descendants?.length || 0} comments</span>
            </span>
          </td>
        </tr>
        <tr className="h-2.5"></tr>
        <tr>
          <td colSpan={2} />
          <td>
            <CommentInputForm
              formAction={handleFormSubmit}
              parentId={item.id}
              ancestorId={item.id}
              submitTitle="add comment"
              formRef={ref}
            ></CommentInputForm>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
