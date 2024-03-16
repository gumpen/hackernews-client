import {
  ItemWithAncestor,
  ItemWithDescendants,
  AppUser,
} from "@/lib/definitions";
import { CommentItem } from "./comment-item";

export interface CommentFeedProps {
  items: ItemWithAncestor[];
  user?: AppUser;
}

export const CommentFeed = ({ items, user }: CommentFeedProps) => {
  return (
    <table>
      <tbody>
        {items.map((item, i) => {
          const voted = user?.upvotedItems.includes(item.id) || false;
          const favorited = user?.favoriteItems.includes(item.id) || false;
          return (
            <>
              <CommentItem
                item={item}
                userId={user?.id}
                voted={voted}
                favorited={favorited}
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
