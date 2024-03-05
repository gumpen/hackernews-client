import DummyItems from "@/dummy";
import NewsFeed from "@/components/news-feed";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { userService } from "@/server/service";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/api";
// import { getCurrentUser } from "@/app/actions";

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
