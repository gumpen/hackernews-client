import NewsFeed, { NewsFeedProps } from "@/components/news-feed";
import { getCurrentUser } from "@/lib/api";
import { itemService, userService } from "@/server/service";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";
import { getPageQuery, shouldShowMore } from "@/lib/util";

export default async function NewestPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNumber = getPageQuery(searchParams);

  const { stories, totalCount } = await itemService.getNewestStories(
    pageNumber,
    ITEM_NUM_PER_PAGE
  );

  const props: NewsFeedProps = {
    items: stories,
    page: pageNumber,
    perPage: ITEM_NUM_PER_PAGE,
    showMore: shouldShowMore(totalCount, pageNumber, ITEM_NUM_PER_PAGE),
  };

  const currentUser = await getCurrentUser();
  if (currentUser) {
    props.user = currentUser;
  }

  return <NewsFeed {...props} />;
}
