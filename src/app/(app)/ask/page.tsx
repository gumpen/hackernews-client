import { getCurrentUser } from "@/lib/api";
import NewsFeed, { NewsFeedProps } from "@/components/news-feed";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";
import { itemService } from "@/server/service";
import { z } from "zod";
import { shouldShowMore } from "@/lib/util";

export default async function AskPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageSchema = z.coerce.number().min(1);
  const parseResult = pageSchema.safeParse(searchParams["p"]);
  let pageNumber = 1;
  if (parseResult.success) {
    pageNumber = parseResult.data;
  }

  const currentUser = await getCurrentUser();

  const { items, totalCount } = await itemService.getAskStories(
    pageNumber,
    ITEM_NUM_PER_PAGE
  );

  const showMore = shouldShowMore(totalCount, pageNumber, ITEM_NUM_PER_PAGE);

  const props: NewsFeedProps = {
    items: items,
    page: pageNumber,
    perPage: ITEM_NUM_PER_PAGE,
    showMore: showMore,
  };
  if (currentUser) {
    props.user = currentUser;
  }

  return <NewsFeed {...props} />;
}
