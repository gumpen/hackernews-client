"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderNav from "./header-nav";

export interface Props {
  user: { id: string; karma: number } | undefined;
  title?: string;
  isNavVisible?: boolean;
  isAuthVisible?: boolean;
  pageNameShowInNav?: string | undefined;
}

const Header = ({
  user,
  title = "Hacker News",
  isNavVisible = true,
  isAuthVisible = true,
  pageNameShowInNav,
}: Props) => {
  // const { user } = props;

  // const router = useRouter();

  // TODO: to server action
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
            <Link href={"/"}>
              <img
                className="border border-white border-solid block"
                src="y18.svg"
                width={20}
                height={20}
              ></img>
            </Link>
          </td>
          <td>
            <HeaderNav
              title={title}
              isNavVisible={isNavVisible}
              pageNameShowInNav={pageNameShowInNav}
            ></HeaderNav>
          </td>
          {isAuthVisible ? (
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
          ) : (
            <></>
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default Header;
