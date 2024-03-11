"use client";

import { Item } from "@prisma/client";
import Link from "next/link";
import { convertNumberToTimeAgo } from "@/lib/util";
import styles from "./style.module.css";
import classNames from "classnames";
import { useEffect, MouseEvent, useState } from "react";
import { ItemWithKids } from "@/lib/definitions";

export interface CommentRowProps {
  item: ItemWithKids;
  depth?: number;
  focus?: number | undefined;
  root?: number;
  parent?: number;
  prev?: number;
  next?: number;
  hidden?: boolean;
}

export const CommentRow = ({
  item,
  depth = 0,
  focus,
  root,
  parent,
  prev,
  next,
  hidden = false,
}: CommentRowProps) => {
  const [collapse, setCollapse] = useState(false);

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

  const onClickCollapse = (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();

    setCollapse(!collapse);
  };

  const shouldHideKids = () => {
    return hidden || collapse || false;
  };

  const countDescendants = (kids: ItemWithKids[] | undefined): number => {
    if (!kids) return 0;
    return kids.reduce((count, item) => {
      if (item.kids && item.kids.length > 0) {
        const kidsCount = countDescendants(item.kids);
        return count + kidsCount + 1;
      }
      return count + 1;
    }, 0);
  };

  const renderKidComments = (
    kids: ItemWithKids[],
    depth: number = 0,
    hidden: boolean,
    rootCommentId?: number
  ): JSX.Element[] => {
    if (kids.length > 0) {
      return kids.reduce<JSX.Element[]>((components, item, index, array) => {
        const props: CommentRowProps = {
          item: item,
          depth: depth,
          focus: focus,
          hidden: hidden,
        };

        // root
        // 条件: depthが2以上(3階層目以降)
        // 動作: depthが0のroot commentへ移動、storyではない
        if (depth > 1 && rootCommentId) {
          props.root = rootCommentId;
        }

        // parent
        // 条件: depthが1以上(= parentIdがstory.idではない)
        // 動作: parentIdのcommentへ移動
        if (depth > 0 && item.parentId) {
          props.parent = item.parentId;
        }

        // prev
        // 条件: 同depth(階層)のcommentが2件以上あり、最初のものではない
        // 動作: 同depthの1件前のcommentへ移動
        if (array.length > 1 && index !== 0) {
          const pr = array[index - 1];
          if (pr) {
            props.prev = pr.id;
          }
        }

        // next
        // 条件: 同depth(階層)のcommentが2件以上あり、最後のものではない
        // 動作: 同depthの1件先のcommentへ移動
        if (array.length > 1 && index !== array.length - 1) {
          const nx = array[index + 1];
          if (nx) {
            props.next = nx.id;
          }
        }

        const currentComponent = <CommentRow {...props} key={item.id} />;

        let root: number;
        if (rootCommentId) {
          root = rootCommentId;
        } else {
          root = item.id;
        }

        return components.concat(currentComponent);
      }, []);
    } else {
      return [];
    }
  };

  return (
    <>
      <tr className={classNames({ hidden: hidden })} id={`comment-${item.id}`}>
        <td className={rowClassName(item.id, focus)}>
          <table className="border-separate">
            <tbody>
              <tr>
                <td width={40 * depth}></td>
                <td style={{ verticalAlign: "top" }}>
                  <div className="w-3 h-3 mx-1 mt-0.5">
                    <img
                      className={classNames({ invisible: collapse })}
                      src="triangle.svg"
                      width={10}
                      height={10}
                    />
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
                      )}{" "}
                      <a
                        className="hover:underline cursor-pointer"
                        onClick={onClickCollapse}
                      >
                        {collapse
                          ? `[${countDescendants(item.kids) + 1} more]`
                          : "[-]"}
                      </a>
                    </span>
                  </div>
                  <div className="h-1"></div>
                  {collapse ? (
                    <></>
                  ) : (
                    <div className="text-xs">
                      <span>{item.text}</span>
                      <div className="mt-2 text-2xs">
                        <p>
                          <Link
                            className="underline"
                            href={`/reply?id=${item.id}`}
                          >
                            reply
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      {item.kids && item.kids.length > 0 ? (
        renderKidComments(
          item.kids,
          depth + 1,
          shouldHideKids(),
          root ? root : item.id
        )
      ) : (
        <></>
      )}
    </>
  );
};
