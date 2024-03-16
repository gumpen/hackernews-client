import { Item } from "@prisma/client";
import { ItemWithDescendants, ItemWithKids, AppUser } from "@/lib/definitions";
import { CommentRow, CommentRowProps } from "./comment-row";

interface Props {
  item: ItemWithDescendants;
  focus?: number;
  user?: AppUser | null;
}

export const CommentTree = ({ item, focus, user }: Props) => {
  const buildDescendantsTree = (
    rootItem: ItemWithDescendants
  ): ItemWithKids[] => {
    const allDecendants = rootItem.descendants;
    if (!allDecendants) {
      return [];
    }

    const tempStorage = new Map<number, Item & { kids?: Item[] }>();
    allDecendants.forEach((item) => {
      tempStorage.set(item.id, { ...item, kids: [] });
    });

    tempStorage.forEach((value, key) => {
      if (value.parentId) {
        if (value.parentId !== rootItem.id) {
          const parent = tempStorage.get(value.parentId);
          if (parent) {
            parent.kids?.push(value);
          }
        }
      }
    });

    return Array.from(tempStorage.values()).filter(
      (item) => item.parentId === rootItem.id
    );
  };

  const buildCommentTreeComponents = (items: ItemWithKids[]): JSX.Element[] => {
    const userId = user ? user.id : undefined;

    return items.reduce<JSX.Element[]>((components, item, index, array) => {
      const props: CommentRowProps = {
        item: item,
        focus: focus,
      };

      if (userId) {
        props.userId = userId;
      }

      if (user?.upvotedItems) {
        props.userUpvotedItemIds = user.upvotedItems;
      }

      // prev
      // 条件: 同depth(階層)のcommentが2件以上あり、最初のものではない
      // 動作: 同depthの1件前のcommentへ移動
      if (array.length > 1 && index !== 0) {
        const pr = array[index - 1];
        if (pr) {
          props.prev = pr.id;
        }
      }

      // next
      // 条件: 同depth(階層)のcommentが2件以上あり、最後のものではない
      // 動作: 同depthの1件先のcommentへ移動
      if (array.length > 1 && index !== array.length - 1) {
        const nx = array[index + 1];
        if (nx) {
          props.next = nx.id;
        }
      }

      const currentComponent = <CommentRow {...props} key={item.id} />;

      return components.concat(currentComponent);
    }, []);
  };

  const itemTree = buildDescendantsTree(item);

  return (
    <table className="border-separate">
      <tbody>{buildCommentTreeComponents(itemTree)}</tbody>
    </table>
  );
};
