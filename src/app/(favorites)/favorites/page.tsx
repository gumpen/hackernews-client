import { z } from "zod";
import { getCurrentUser } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { itemService, userService } from "@/server/service";
import NewsFeed, { NewsFeedProps } from "@/components/news-feed";
import { CommentFeed, CommentFeedProps } from "@/components/comment-feed";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";
import { User } from "@/lib/definitions";
import Link from "next/link";
import { getPageQuery, shouldShowMore } from "@/lib/util";

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

  const pageNumber = getPageQuery(searchParams);

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
    const { items, totalCount } =
      await itemService.getFavoritedCommentsByUserId(
        displayUserId,
        pageNumber,
        ITEM_NUM_PER_PAGE
      );

    const props: CommentFeedProps = {
      items: items,
      showMore: shouldShowMore(totalCount, pageNumber, ITEM_NUM_PER_PAGE),
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
    const { items, totalCount } =
      await itemService.getFavoritedSubmissionsByUserId(
        displayUserId,
        pageNumber,
        ITEM_NUM_PER_PAGE
      );

    const props: NewsFeedProps = {
      items: items,
      page: pageNumber,
      perPage: ITEM_NUM_PER_PAGE,
      showMore: shouldShowMore(totalCount, pageNumber, ITEM_NUM_PER_PAGE),
    };
    if (currentUser) {
      props.user = currentUser;
    }

    return (
      <>
        {renderTabSwitch()}
        <NewsFeed {...props} />
      </>
    );
  }
}
