const Header = () => {
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
            <span className="text-sm">
              <a>gumpen (1) </a>
              {" | "}
              <a>logout</a>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Header;
