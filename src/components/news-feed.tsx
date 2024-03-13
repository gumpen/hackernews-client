import { ItemWithDescendants, User } from "@/lib/definitions";
import { NewsItem } from "./news-item";
import Link from "next/link";
import { addQueryParameter } from "@/lib/util";

export interface NewsFeedProps {
  items: ItemWithDescendants[];
  currentPath: string;
  page: number;
  perPage: number;
  user?: User;
}

const NewsFeed = ({
  items,
  currentPath,
  page,
  perPage,
  user,
}: NewsFeedProps) => {
  const userUpvotedIds = (): number[] => {
    if (user && user.upvotedItems) {
      return user.upvotedItems.map((relation) => relation.itemId);
    } else {
      return [];
    }
  };

  const userFavoritedItemIds = () => {
    if (user && user.favoriteItems) {
      return user.favoriteItems.map((relation) => relation.itemId);
    } else {
      return [];
    }
  };

  return (
    <table>
      <tbody>
        {items.map((item, i) => {
          const voted = userUpvotedIds().includes(item.id);
          const favorited = userFavoritedItemIds().includes(item.id);
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
          <td className="text-sm text-content-gray">
            <Link
              href={addQueryParameter(currentPath, "p", (page + 1).toString())}
            >
              More
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsFeed;
