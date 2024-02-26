import { Item } from "@/app/page";
import { convertNumberToTimeAgo, toHostname } from "@/lib/util";

const NewsFeed = ({ items }: { items: Item[] }) => {
  return (
    <table>
      <tbody>
        {items.map((item, i) => {
          return (
            <>
              <tr key={`${item.id}-title-row`}>
                <td
                  className="text-sm pt-1"
                  style={{ textAlign: "right", verticalAlign: "top" }}
                >
                  <span className="text-content-gray">{`${i + 1}.`}</span>
                </td>
                <td className="pt-1" style={{ verticalAlign: "top" }}>
                  <div className="w-3 h-3 mx-1">
                    <img
                      src="triangle.svg"
                      width={10}
                      height={10}
                      className="mt-1"
                    />
                  </div>
                </td>
                <td>
                  <span className="text-sm">
                    <a href={item.url} target="_blank">
                      {item.title}
                    </a>
                  </span>
                  <span className="text-2xs text-content-gray">{` (${toHostname(item.url)})`}</span>
                </td>
              </tr>
              <tr className="h-1" key={`${item.id}-detail-row`}>
                <td colSpan={2} />
                <td className="text-3xs">
                  <span className="text-content-gray">
                    <span>{item.score} points</span>
                    <span>by {item.by}</span>
                    <span>{convertNumberToTimeAgo(item.time * 1000)}</span>
                    {" | "}
                    <span>hide</span>
                    {" | "}
                    <span>{item.descendants} comments</span>
                  </span>
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default NewsFeed;
