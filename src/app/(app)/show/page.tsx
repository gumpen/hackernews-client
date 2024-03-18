import { getCurrentUser } from "@/lib/api";
import NewsFeed, { NewsFeedProps } from "@/components/news-feed";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";
import { itemService } from "@/server/service";
import { shouldShowMore, getPageQuery } from "@/lib/util";

export default async function ShowPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNumber = getPageQuery(searchParams);

  const currentUser = await getCurrentUser();

  const { items, totalCount } = await itemService.getShowStories(
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

  return <NewsFeed {...props} />;
}
