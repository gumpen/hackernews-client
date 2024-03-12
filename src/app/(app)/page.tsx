import NewsFeed from "@/components/news-feed";
import { itemService } from "@/server/service";

export default async function Home() {
  const stories = await itemService.getStories();
  return <NewsFeed items={stories} />;
}
