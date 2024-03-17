import { z } from "zod";
import { getCurrentUser } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { itemService, userService } from "@/server/service";
import NewsFeed from "@/components/news-feed";
import { CommentFeed } from "@/components/comment-feed";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";

export default async function UpvotedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  // idのキーが存在しない場合(undefined)はcurrentUserと見なして表示するためoptional
  const userIdSchema = z.string().min(1).optional();
  const userIdParseResult = userIdSchema.safeParse(searchParams["id"]);
  if (!userIdParseResult.success) {
    notFound();
  }

  // idがcurrentUserではない
  if (userIdParseResult.data && currentUser.id !== userIdParseResult.data) {
    // TODO: notFoundではなくカスタムエラーなどを使って表示するエラー内容を制御する
    notFound();
  }

  const commentFlagSchema = z.string().min(1).optional();
  const commentFlagParseResult = commentFlagSchema.safeParse(
    searchParams["comments"]
  );
  if (!commentFlagParseResult.success) {
    notFound();
  }

  if (commentFlagParseResult.data && commentFlagParseResult.data === "t") {
    // commentsタブの表示
    const items = await itemService.getUpvotedCommentsByUserId(currentUser.id);
    return <CommentFeed items={items} user={currentUser}></CommentFeed>;
  } else {
    // submissionsタブの表示
    const items = await itemService.getUpvotedSubmissionsByUserId(
      currentUser.id
    );

    // TODO: pagination対応
    return (
      <NewsFeed
        items={items}
        user={currentUser}
        page={1}
        perPage={ITEM_NUM_PER_PAGE}
      />
    );
  }
}
