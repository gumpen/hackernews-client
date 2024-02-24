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

export default function Home() {
  // console.log(DummyItems);
  return (
    <div>
      <table className="bg-main-content-color w-5/6 mx-auto">
        <tbody>
          <tr className="bg-yc-orange" key={"header"}>
            <td>ヘッダー</td>
          </tr>
          <tr className="h-3" key={"space"}></tr>
          <tr key={"news-feed"}>
            <td>
              <NewsFeed items={DummyItems} />
            </td>
          </tr>
          <tr key={"footer"}>
            <td>フッター</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
