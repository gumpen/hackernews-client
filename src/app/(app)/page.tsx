import NewsFeed from "@/components/news-feed";
import { getCurrentUser } from "@/lib/api";
import { itemService, userService } from "@/server/service";

export default async function Home() {
  const stories = await itemService.getStories();
  const currentUser = await getCurrentUser();
  if (currentUser) {
    const withUpvoted = await userService.getUserWithUpvotedIds(currentUser.id);
    if (withUpvoted) {
      return <NewsFeed items={stories} user={withUpvoted} />;
    }
  }
  return <NewsFeed items={stories} />;
}
