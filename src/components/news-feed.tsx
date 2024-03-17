import { Item, ItemWithDescendants, AppUser } from "@/lib/definitions";
import { NewsItem } from "./news-item";
import Link from "next/link";
import { addQueryParameter } from "@/lib/util";
import { MoreTextButton } from "./more-text-button";

export interface NewsFeedProps {
  items: Item[];
  page: number;
  perPage: number;
  user?: AppUser;
}

const NewsFeed = ({ items, page, perPage, user }: NewsFeedProps) => {
  return (
    <table>
      <tbody>
        {items.map((item, i) => {
          const voted = user?.upvotedItems.includes(item.id) || false;
          const favorited = user?.favoriteItems.includes(item.id) || false;
          return (
            <NewsItem
              item={item}
              user={user}
              rank={i + 1 + (page - 1) * perPage}
              voted={voted}
              favorited={favorited}
              key={item.id}
            ></NewsItem>
          );
        })}
        <tr className="h-3"></tr>
        <tr>
          <td colSpan={2}></td>
          <td>
            <MoreTextButton></MoreTextButton>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsFeed;
