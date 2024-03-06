import Link from "next/link";

interface Props {
  title: string;
  isNavVisible?: boolean;
}

const HeaderNav = ({ title, isNavVisible = true }: Props) => {
  return isNavVisible ? (
    <span className="text-sm">
      <Link href={"/news"}>
        <b className="mr-2 ml-px">{title}</b>
      </Link>
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
      <Link href={"/submit"}>submit</Link>
    </span>
  ) : (
    <span className="text-sm">
      <b className="mr-2 ml-px">{title}</b>
    </span>
  );
};

export default HeaderNav;
