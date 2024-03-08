import { Item } from "@prisma/client";
import { ItemWithDescendants, ItemWithKids } from "@/lib/definitions";
import { CommentRow } from "./comment-row";

interface Props {
  item: ItemWithDescendants;
}

// interface Node {
//   id: number;
//   kids: Node[];
// }

export const CommentTree = ({ item }: Props) => {
  //   const descendantsTree = (origin: ItemWithDescendants) => {
  //     const allDecendants = origin.descendants;
  //     if (!allDecendants) {
  //       return [];
  //     }

  //     const buildTree = (tree: Node[], item: Item): boolean => {
  //       for (const node of tree) {
  //         if (item.parentId === node.id) {
  //           node.kids.push({ id: item.id, kids: [] });
  //           return true;
  //         }
  //         const found = buildTree(node.kids, item);
  //         if (found) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     };

  //     const tree: Node[] = [];
  //     for (const d of allDecendants.sort((a, b) => a.id - b.id)) {
  //       const found = buildTree(tree, d);
  //       if (!found) {
  //         tree.push({ id: d.id, kids: [] });
  //       }
  //     }

  //     return tree;
  //   };

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

  //   const buildCommentTreeComponents = (
  //     tree: Node[],
  //     items: Item[],
  //     depth: number = 0
  //   ): JSX.Element[] => {
  //     return tree.reduce<JSX.Element[]>((components, node) => {
  //       const item = items.find((i) => i.id === node.id);
  //       if (!item) {
  //         throw new Error("internal error");
  //       }

  //       const currentComponent = (
  //         <CommentRow item={item} depth={depth} key={item.id} />
  //       );

  //       const childComponents =
  //         node.kids.length > 0
  //           ? buildCommentTreeComponents(node.kids, items, depth + 1)
  //           : [];

  //       return components.concat(currentComponent, childComponents);
  //     }, []);
  //   };

  const buildCommentTreeComponents = (
    items: ItemWithKids[],
    depth: number = 0
  ): JSX.Element[] => {
    return items.reduce<JSX.Element[]>((components, item) => {
      const currentComponent = (
        <CommentRow item={item} depth={depth} key={item.id} />
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
