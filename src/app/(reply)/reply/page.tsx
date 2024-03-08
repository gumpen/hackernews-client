import { z } from "zod";
import { itemService } from "@/server/service";
import { redirect } from "next/navigation";
import { CommentForm } from "@/components/comment-form";

export default async function ReplyPage({
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

  if (item.type !== "comment") {
    redirect(`/item?id=${item.id}`);
  }

  if (!item.ancestorId) {
    redirect(`/item?id=${item.id}`);
  }

  const ancestorItem = await itemService.getItem(item.ancestorId);
  if (!ancestorItem) {
    redirect(`/item?id=${item.id}`);
  }

  return <CommentForm item={item} ancestorItem={ancestorItem}></CommentForm>;
}
