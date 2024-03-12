import { ItemDetail } from "@/components/item-detail";
import { CommentItemDetail } from "@/components/comment-item-detail";
import { CommentTree } from "@/components/comment-tree";
import { itemService, userService } from "@/server/service";
import { z } from "zod";
import { Item } from "@prisma/client";
import { getCurrentUser } from "@/lib/api";
import { User } from "@/lib/definitions";

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

  const currentUser = await getCurrentUser();
  const user = currentUser
    ? await userService.getUserWithUpvotedIds(currentUser.id)
    : null;

  let focusCommentId: number | undefined = undefined;
  try {
    const focusSchema = z.coerce.number().min(1);
    focusCommentId = focusSchema.parse(searchParams["focus"]);
  } catch {
    // coerceに失敗した場合はundefinedのまま
  }

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
        <CommentItemDetail
          item={item}
          ancestorItem={story}
          user={user}
        ></CommentItemDetail>
        <br />
        <br />
        {focusCommentId ? (
          <CommentTree
            item={item}
            user={user}
            focus={focusCommentId}
          ></CommentTree>
        ) : (
          <CommentTree item={item} user={user}></CommentTree>
        )}
      </>
    );
  }

  return (
    <>
      <ItemDetail item={item} user={user}></ItemDetail>
      <br />
      <br />
      {focusCommentId ? (
        <CommentTree
          item={item}
          user={user}
          focus={focusCommentId}
        ></CommentTree>
      ) : (
        <CommentTree item={item} user={user}></CommentTree>
      )}
    </>
  );
}
