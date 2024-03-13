import NewsFeed from "@/components/news-feed";
import { getCurrentUser } from "@/lib/api";
import { itemService, userService } from "@/server/service";
import { z } from "zod";
import { ITEM_NUM_PER_PAGE } from "@/lib/constants";

export default async function Home({
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

  const stories = await itemService.getStories(pageNumber, ITEM_NUM_PER_PAGE);
  const currentUser = await getCurrentUser();
  if (currentUser) {
    const withUpvoted = await userService.getUserWithUpvotedIds(currentUser.id);
    if (withUpvoted) {
      return (
        <NewsFeed
          items={stories}
          user={withUpvoted}
          page={pageNumber}
          perPage={ITEM_NUM_PER_PAGE}
          currentPath={"/"}
        />
      );
    }
  }
  return (
    <NewsFeed
      items={stories}
      page={pageNumber}
      perPage={ITEM_NUM_PER_PAGE}
      currentPath={"/"}
    />
  );
}
