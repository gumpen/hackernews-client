import { ItemWithDescendants, User } from "@/lib/definitions";
import { NewsItem } from "./news-item";
import Link from "next/link";
import { addQueryParameter } from "@/lib/util";

const NewsFeed = ({
  items,
  currentPath,
  page,
  perPage,
  user,
}: {
  items: ItemWithDescendants[];
  currentPath: string;
  page: number;
  perPage: number;
  user?: User;
}) => {
  // const userFavoriteIds = (): number[] => {
  //   if (user && user.favoriteItems) {
  //     return user.favoriteItems.map((relation) => relation.itemId);
  //   } else {
  //     return [];
  //   }
  // };

  const userUpvotedIds = (): number[] => {
    if (user && user.upvotedItems) {
      return user.upvotedItems.map((relation) => relation.itemId);
    } else {
      return [];
    }
  };

  return (
    <table>
      <tbody>
        {items.map((item, i) => {
          const voted = userUpvotedIds().includes(item.id);
          return (
            <NewsItem
              item={item}
              user={user}
              rank={i + 1 + (page - 1) * perPage}
              voted={voted}
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
