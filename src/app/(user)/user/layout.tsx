import Header from "@/components/header";
import { getCurrentUser } from "@/lib/api";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <table className="bg-main-content-color w-5/6 mx-auto">
      <tbody>
        <tr className="bg-yc-orange" key={"header"}>
          <td>
            <Header user={user} />
          </td>
        </tr>
        <tr className="h-3" key={"space1"}></tr>
        <tr key={"news-feed"}>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
}
