import { CommentFeed, CommentFeedProps } from "@/components/comment-feed";
import { getCurrentUser } from "@/lib/api";
import { itemService, userService } from "@/server/service";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";
import { getPageQuery, shouldShowMore } from "@/lib/util";

export default async function NewCommentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNumber = getPageQuery(searchParams);

  const { comments, totalCount } = await itemService.getNewestComments(
    pageNumber,
    ITEM_NUM_PER_PAGE
  );

  const props: CommentFeedProps = {
    items: comments,
    showMore: shouldShowMore(totalCount, pageNumber, ITEM_NUM_PER_PAGE),
  };

  const currentUser = await getCurrentUser();
  if (currentUser) {
    props.user = currentUser;
  }

  return <CommentFeed {...props} />;
}
