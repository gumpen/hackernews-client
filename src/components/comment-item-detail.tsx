"use client";

import { Item } from "@prisma/client";
import { convertNumberToTimeAgo } from "@/lib/util";
import { ReplyCommentActionState, replyComment } from "@/app/actions";
import { useFormState } from "react-dom";
import { ItemWithKids } from "@/lib/definitions";
import Link from "next/link";

interface Props {
  item: ItemWithKids;
  ancestorItem: Item;
}

export const CommentItemDetail = ({ item, ancestorItem }: Props) => {
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
          <td className="align-top">
            <div className="w-3 h-3 mx-1 mb-1">
              <img src="triangle.svg" width={10} height={10} className="mt-1" />
            </div>
          </td>
          <td className="text-2xs">
            <span className="text-content-gray">
              <span>{item.userId} </span>
              <span>{convertNumberToTimeAgo(item.created.getTime())}</span>
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
            <form action={formDispatch}>
              <input type="hidden" name="parent" value={item.id}></input>
              <input
                type="hidden"
                name="ancestor"
                value={ancestorItem.id}
              ></input>
              <input
                type="hidden"
                name="goto"
                value={`/item?id=${item.id}`}
              ></input>
              <textarea
                name="text"
                className="text-xs border border-gray-500 py-px px-0.5"
                rows={8}
                cols={80}
              ></textarea>
              <br />
              <br />
              <input
                className="border border-gray-500 bg-gray-200 text-sm py-px px-1.5"
                type="submit"
                value="reply"
              ></input>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
