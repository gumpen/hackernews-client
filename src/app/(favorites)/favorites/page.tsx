import { z } from "zod";
import { getCurrentUser } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { itemService, userService } from "@/server/service";
import NewsFeed, { NewsFeedProps } from "@/components/news-feed";
import { CommentFeed, CommentFeedProps } from "@/components/comment-feed";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";
import { User } from "@/lib/definitions";
import Link from "next/link";

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentUser = await getCurrentUser();

  const userIdSchema = z.string().min(1);
  const userIdParseResult = userIdSchema.safeParse(searchParams["id"]);
  if (!userIdParseResult.success) {
    notFound();
  }

  if (!currentUser && !userIdParseResult.data) {
    notFound();
  }

  const displayUserId = userIdParseResult.data;

  const commentFlagSchema = z.string().min(1).optional();
  const commentFlagParseResult = commentFlagSchema.safeParse(
    searchParams["comments"]
  );
  if (!commentFlagParseResult.success) {
    notFound();
  }

  const renderTabSwitch = () => {
    return (
      <div className="ml-9 mt-2 mb-3 text-sm text-content-gray">
        <Link href={`/favorites?id=${displayUserId}`}>submissions</Link>
        {" | "}
        <Link href={`/favorites?id=${displayUserId}&comments=t`}>comments</Link>
      </div>
    );
  };

  if (commentFlagParseResult.data && commentFlagParseResult.data === "t") {
    // commentsタブの表示
    const items = await itemService.getFavoritedCommentsByUserId(displayUserId);

    const props: CommentFeedProps = {
      items: items,
    };
    if (currentUser) {
      props.user = currentUser;
    }

    return (
      <>
        {renderTabSwitch()}
        <CommentFeed {...props}></CommentFeed>
      </>
    );
  } else {
    // submissionsタブの表示
    const items =
      await itemService.getFavoritedSubmissionsByUserId(displayUserId);

    const props: NewsFeedProps = {
      items: items,
      page: 1,
      perPage: ITEM_NUM_PER_PAGE,
      currentPath: "/favorite",
    };
    if (currentUser) {
      props.user = currentUser;
    }

    // TODO: pagination対応
    return (
      <>
        {renderTabSwitch()}
        <NewsFeed {...props} />
      </>
    );
  }
}
