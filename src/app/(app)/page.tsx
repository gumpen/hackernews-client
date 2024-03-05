import DummyItems from "@/dummy";
import NewsFeed from "@/components/news-feed";

export interface Item {
  id: number;
  by: string;
  descendants: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

export default async function Home() {
  return <NewsFeed items={DummyItems} />;
}
