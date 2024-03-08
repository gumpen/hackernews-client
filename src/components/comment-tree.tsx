import { Item } from "@prisma/client";
import { ItemWithDescendants, ItemWithKids } from "@/lib/definitions";
import { CommentRow } from "./comment-row";

interface Props {
  item: ItemWithDescendants;
  focus?: number;
}

export const CommentTree = ({ item, focus }: Props) => {
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

  const buildCommentTreeComponents = (
    items: ItemWithKids[],
    depth: number = 0
  ): JSX.Element[] => {
    return items.reduce<JSX.Element[]>((components, item) => {
      const currentComponent = (
        <CommentRow item={item} depth={depth} key={item.id} focus={focus} />
      );

      const childComponents =
        item.kids && item.kids.length > 0
          ? buildCommentTreeComponents(item.kids, depth + 1)
          : [];

      return components.concat(currentComponent, childComponents);
    }, []);
  };

  const itemTree = buildDescendantsTree(item);

  return (
    <table className="border-separate">
      <tbody>{buildCommentTreeComponents(itemTree)}</tbody>
    </table>
  );
};
