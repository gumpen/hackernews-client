import { ItemWithDescendants, User } from "@/lib/definitions";
import { NewsItem } from "./news-item";

const NewsFeed = ({
  items,
  user,
}: {
  items: ItemWithDescendants[];
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
              index={i}
              voted={voted}
              key={item.id}
            ></NewsItem>
          );
        })}
      </tbody>
    </table>
  );
};

export default NewsFeed;
