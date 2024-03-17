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
    return (
      <NewsFeed
        items={stories}
        user={currentUser}
        page={pageNumber}
        perPage={ITEM_NUM_PER_PAGE}
      />
    );
  }
  return (
    <NewsFeed items={stories} page={pageNumber} perPage={ITEM_NUM_PER_PAGE} />
  );
}
