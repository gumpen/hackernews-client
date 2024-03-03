"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export interface Props {
  user: { id: string; karma: number } | undefined;
}

const Header = (props: Props) => {
  const { user } = props;

  const router = useRouter();

  const onClickLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    document.cookie = "user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    // router.push("/");
  };

  return (
    <table
      className="p-0.5 w-full border-separate"
      border={0}
      cellPadding={0}
      cellSpacing={0}
    >
      <tbody>
        <tr key={"header-row"}>
          <td className="w-6 pr-1">
            <img
              className="border border-white border-solid block"
              src="y18.svg"
              width={20}
              height={20}
            ></img>
          </td>
          <td>
            <span className="text-sm">
              <b className="mr-2 ml-px">Hacker News</b>
              <a>new</a>
              {" | "}
              <a>threads</a>
              {" | "}
              <a>past</a>
              {" | "}
              <a>comments</a>
              {" | "}
              <a>ask</a>
              {" | "}
              <a>show</a>
              {" | "}
              <a>jobs</a>
              {" | "}
              <a>submit</a>
            </span>
          </td>
          <td className="text-right pr-1">
            {user ? (
              <span className="text-sm">
                <Link href={`/user?id=${user.id}`}>{user.id}</Link>
                {` (${user.karma}) | `}
                <a href="/" onClick={onClickLogout}>
                  logout
                </a>
              </span>
            ) : (
              <span className="text-sm">
                <Link href={`/login`}>login</Link>
              </span>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Header;
