import { ItemWithAncestor, ItemWithDescendants, User } from "@/lib/definitions";
import { CommentItem } from "./comment-item";

export interface CommentFeedProps {
  items: ItemWithAncestor[];
  user?: User;
}

export const CommentFeed = ({ items, user }: CommentFeedProps) => {
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
            <>
              <CommentItem
                item={item}
                userId={user?.id}
                voted={voted}
                key={item.id}
              ></CommentItem>
              <tr className="h-4"></tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
};
