import { ItemDetail } from "@/components/item-detail";
import { CommentTree } from "@/components/comment-tree";
import { itemService } from "@/server/service";
import { z } from "zod";

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
  //   const focusCommentId = searchParams["focus"];
  try {
    const focusSchema = z.coerce.number().min(1);
    focusCommentId = focusSchema.parse(searchParams["focus"]);
  } catch {}

  // TODO: item.typeがcommentだった場合の追加

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
