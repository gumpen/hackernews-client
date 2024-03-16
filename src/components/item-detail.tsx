"use client";

import { Item } from "@prisma/client";
import { toHostname, convertNumberToTimeAgo } from "@/lib/util";
import { PostCommentActionState, postComment } from "@/app/actions";
import { useRef, FormEvent, useState } from "react";
import { useFormState } from "react-dom";
import { ItemWithDescendants, AppUser } from "@/lib/definitions";
import { UpvoteButton } from "./upvote-button";
import { UnvoteTextButton } from "./unvote-text-button";
import { CommentInputForm } from "./comment-input-form";
import { FavoriteTextButton } from "./favorite-text-button";

interface Props {
  item: ItemWithDescendants;
  user?: AppUser | null;
}

export const ItemDetail = ({ item, user }: Props) => {
  const [voted, setVoted] = useState(
    user?.upvotedItems.includes(item.id) || false
  );
  const [favorited, setFavorited] = useState(
    user?.favoriteItems.includes(item.id) || false
  );
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
              <FavoriteTextButton
                userId={user?.id}
                itemId={item.id}
                favorited={favorited}
                setFavorited={setFavorited}
              ></FavoriteTextButton>
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
