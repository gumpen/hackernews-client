"use client";

import { Item } from "@prisma/client";
import Link from "next/link";
import { convertNumberToTimeAgo } from "@/lib/util";
import styles from "./style.module.css";
import classNames from "classnames";
import { useEffect, MouseEvent } from "react";

export interface CommentRowProps {
  item: Item;
  depth: number;
  focus?: number | undefined;
  root?: number;
  parent?: number;
  prev?: number;
  next?: number;
}

export const CommentRow = ({
  item,
  depth,
  focus,
  root,
  parent,
  prev,
  next,
}: CommentRowProps) => {
  useEffect(() => {
    if (focus) {
      const element = document.getElementById(`comment-${focus}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [focus]);

  const rowClassName = (itemId: number, focus: number | undefined) => {
    if (!focus || itemId !== focus) {
      return "";
    }
    return classNames({ [styles.animate]: true });
  };

  const onClickScroll = (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();

    const targetId = ev.currentTarget.getAttribute("data-id");
    if (!targetId) return;

    const element = document.getElementById(`comment-${targetId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <tr id={`comment-${item.id}`}>
      <td className={rowClassName(item.id, focus)}>
        <table className="border-separate">
          <tbody>
            <tr>
              <td width={40 * depth}></td>
              <td style={{ verticalAlign: "top" }}>
                <div className="w-3 h-3 mx-1 mt-0.5">
                  <img src="triangle.svg" width={10} height={10} />
                </div>
              </td>
              <td>
                <div className="text-2xs text-content-gray">
                  <span>
                    <Link
                      className="hover:underline"
                      href={`/user?id=${item.userId}`}
                    >
                      {item.userId}
                    </Link>{" "}
                    <Link
                      className="hover:underline"
                      href={`/item?id=${item.id}`}
                    >
                      {convertNumberToTimeAgo(item.created.getTime())}
                    </Link>
                    {" | "}
                    {root ? (
                      <>
                        <a
                          className="hover:underline cursor-pointer"
                          data-id={root}
                          onClick={onClickScroll}
                        >
                          root
                        </a>
                        {" | "}
                      </>
                    ) : (
                      <></>
                    )}
                    {parent ? (
                      <>
                        <a
                          className="hover:underline cursor-pointer"
                          data-id={parent}
                          onClick={onClickScroll}
                        >
                          parent
                        </a>
                        {" | "}
                      </>
                    ) : (
                      <></>
                    )}
                    {prev ? (
                      <>
                        <a
                          className="hover:underline cursor-pointer"
                          data-id={prev}
                          onClick={onClickScroll}
                        >
                          prev
                        </a>
                        {" | "}
                      </>
                    ) : (
                      <></>
                    )}
                    {next ? (
                      <>
                        <a
                          className="hover:underline cursor-pointer"
                          data-id={next}
                          onClick={onClickScroll}
                        >
                          next
                        </a>
                        {" | "}
                      </>
                    ) : (
                      <></>
                    )}
                    <span>{" [-]"}</span>
                  </span>
                </div>
                <div className="h-1"></div>
                <div className="text-xs">
                  <span>{item.text}</span>
                  <div className="mt-2 text-2xs">
                    <p>
                      <Link className="underline" href={`/reply?id=${item.id}`}>
                        reply
                      </Link>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
};
