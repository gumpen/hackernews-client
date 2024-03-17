import { Item } from "@prisma/client";
import { ItemWithDescendants, ItemWithKids, AppUser } from "@/lib/definitions";
import { CommentRow, CommentRowProps } from "./comment-row";

interface Props {
  story: { id: number; title: string | null };
  items: Item[];
  rootCommentId?: number;
  focus?: number;
  user?: AppUser | null;
}

export const CommentTree = ({
  story,
  items,
  rootCommentId,
  focus,
  user,
}: Props) => {
  const buildDescendantsTree = (): ItemWithKids[] => {
    // const allDecendants = rootItem.descendants;
    // if (!allDecendants) {
    //   return [];
    // }

    const tempStorage = new Map<number, Item & { kids?: Item[] }>();
    items.forEach((item) => {
      tempStorage.set(item.id, { ...item, kids: [] });
    });

    tempStorage.forEach((value, key) => {
      if (value.parentId) {
        if (value.parentId !== story.id) {
          const parent = tempStorage.get(value.parentId);
          if (parent) {
            parent.kids?.push(value);
          }
        }
      }
    });

    if (rootCommentId) {
      return Array.from(tempStorage.values()).filter(
        (item) => item.id === rootCommentId
      );
    }

    return Array.from(tempStorage.values()).filter(
      (item) => item.parentId === story.id
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

      if (rootCommentId && story.title) {
        props.ancestorItem = {
          id: story.id,
          title: story.title,
        };
      }

      const currentComponent = <CommentRow {...props} key={item.id} />;

      return components.concat(currentComponent);
    }, []);
  };

  const itemTree = buildDescendantsTree();

  return (
    <table className="border-separate">
      <tbody>{buildCommentTreeComponents(itemTree)}</tbody>
    </table>
  );
};
