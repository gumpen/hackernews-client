"use client";

import { Item } from "@prisma/client";
import { toHostname, convertNumberToTimeAgo } from "@/lib/util";
import { PostCommentyActionState, postComment } from "@/app/actions";
import { useRef, FormEvent } from "react";
import { useFormState } from "react-dom";
import { ItemWithKids } from "@/lib/definitions";

interface Props {
  item: ItemWithKids;
}

export const ItemDetail = ({ item }: Props) => {
  const ref = useRef<HTMLFormElement>(null);
  //   const [formState, formDispatch] = useFormState(
  //     postComment,
  //     {} as PostCommentyActionState
  //   );

  const handleFormSubmit = async (form: FormData) => {
    const res = await postComment({} as PostCommentyActionState, form);
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
          <td className="pt-1" style={{ verticalAlign: "top" }}>
            <div className="w-3 h-3 mx-1">
              <img src="triangle.svg" width={10} height={10} className="mt-1" />
            </div>
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
              {" | "}
              <span>hide</span>
              {" | "}
              <span>past</span>
              {" | "}
              <span>favorite</span>
              {" | "}
              <span>{item.kids?.length || 0} comments</span>
            </span>
          </td>
        </tr>
        <tr className="h-2.5"></tr>
        <tr>
          <td colSpan={2} />
          <td>
            <form ref={ref} action={handleFormSubmit}>
              <input type="hidden" name="parent" value={item.id}></input>
              <input type="hidden" name="ancestor" value={item.id}></input>
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
                value="add comment"
              ></input>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
