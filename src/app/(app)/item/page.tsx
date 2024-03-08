import { ItemDetail } from "@/components/item-detail";
import { CommentItemDetail } from "@/components/comment-item-detail";
import { CommentTree } from "@/components/comment-tree";
import { itemService } from "@/server/service";
import { z } from "zod";
import { Item } from "@prisma/client";

export default async function Item({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const itemIdSchema = z.coerce.number().min(1);
  const parseResult = itemIdSchema.safeParse(searchParams["id"]);
  if (!parseResult.success) {
    return <div>no such item</div>;
  }

  const item = await itemService.getItem(parseResult.data);
  if (!item) {
    return <div>no such item</div>;
  }

  let focusCommentId: number | undefined = undefined;
  try {
    const focusSchema = z.coerce.number().min(1);
    focusCommentId = focusSchema.parse(searchParams["focus"]);
  } catch {}

  if (item.type === "comment") {
    if (!item.ancestorId) {
      return <div>no such item</div>;
    }
    const story = await itemService.getItem(item.ancestorId);
    if (!story) {
      return <div>no such item</div>;
    }

    const storyDescendants = story.descendants;
    const commentDescendants: Item[] = [];
    let searchIds = [item.id];
    let currentIndex = 0;
    while (currentIndex < searchIds.length) {
      const currentId = searchIds[currentIndex];
      const kids = storyDescendants.filter(
        (item) => item.parentId === currentId
      );
      if (kids.length > 0) {
        searchIds.push(...kids.map((i) => i.id));
        commentDescendants.push(...kids);
      }
      currentIndex++;
    }

    item.descendants = commentDescendants;

    return (
      <>
        <CommentItemDetail item={item} ancestorItem={story}></CommentItemDetail>
        <br />
        <br />
        {focusCommentId ? (
          <CommentTree item={item} focus={focusCommentId}></CommentTree>
        ) : (
          <CommentTree item={item}></CommentTree>
        )}
      </>
    );
  }

  return (
    <>
      <ItemDetail item={item}></ItemDetail>
      <br />
      <br />
      {focusCommentId ? (
        <CommentTree item={item} focus={focusCommentId}></CommentTree>
      ) : (
        <CommentTree item={item}></CommentTree>
      )}
    </>
  );
}
