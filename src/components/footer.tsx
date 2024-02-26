const Footer = () => {
  return (
    <>
      <table className="w-full border-separate" cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr key={"footer-row"}>
            <td className="bg-yc-orange p-px"></td>
          </tr>
        </tbody>
      </table>
      <div className="text-center">
        <span className="text-2xs text-content-gray">
          <a>Guidelines</a>
          {" | "}
          <a>FAQ</a>
          {" | "}
          <a>Lists</a>
          {" | "}
          <a>API</a>
          {" | "}
          <a>Security</a>
          {" | "}
          <a>Legal</a>
          {" | "}
          <a>Apply to YC</a>
          {" | "}
          <a>Contact</a>
        </span>
        <br />
        <br />
        <form className="mb-4">
          <span className="text-sm text-content-gray">Search: </span>
          <input
            className="border border-gray-500 text-sm"
            type="text"
            size={17}
          ></input>
        </form>
      </div>
    </>
  );
};

export default Footer;
