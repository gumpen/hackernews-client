"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  isNavVisible?: boolean;
  pageNameShowInNav?: string | undefined;
}

const HeaderNav = ({
  title,
  isNavVisible = true,
  pageNameShowInNav,
}: Props) => {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "new",
      link: "/newest",
    },
    {
      label: "threads",
      link: "/threads",
    },
    {
      label: "comments",
      link: "/newcomments",
    },
    {
      label: "ask",
      link: "/ask",
    },
    {
      label: "show",
      link: "/show",
    },
    {
      label: "submit",
      link: "/submit",
    },
  ];

  return isNavVisible ? (
    <>
      <span className="text-sm">
        <Link href={"/news"}>
          <b className="mr-2 ml-px">{title}</b>
        </Link>
        {menuItems.map(({ label, link }, index) => {
          return (
            <>
              <Link
                key={link}
                href={link}
                className={classNames({ "text-white": pathname === link })}
              >
                {label}
              </Link>
              {index !== menuItems.length - 1 ? " | " : ""}
            </>
          );
        })}
        {pageNameShowInNav ? (
          <>
            {" | "}
            <span className="text-white">{pageNameShowInNav}</span>
          </>
        ) : (
          <></>
        )}
      </span>
    </>
  ) : (
    <>
      <span className="text-sm">
        <b className="mr-2 ml-px">{title}</b>
      </span>
    </>
  );
};

export default HeaderNav;
