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
  const user = await getCurrentUser();
  return (
    <>
      <table className="bg-main-content-color w-5/6 mx-auto">
        <tbody>
          <tr className="bg-yc-orange" key={"header"}>
            <td>
              <Header user={user} />
            </td>
          </tr>
          <tr className="h-3" key={"space1"}></tr>
          <tr key={"news-feed"}>
            <td>
              <NewsFeed items={DummyItems} />
            </td>
          </tr>
          <tr className="h-3" key={"space2"}></tr>
          <tr key={"footer"}>
            <td>
              <Footer />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
