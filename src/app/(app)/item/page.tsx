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

  return (
    <>
      <ItemDetail item={item}></ItemDetail>
      <br />
      <br />
      <CommentTree item={item}></CommentTree>
    </>
  );
}
