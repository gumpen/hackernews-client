import Header from "@/components/header";
import Footer from "@/components/footer";
import { getCurrentUser } from "@/lib/api";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("AppLayout");
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
        <tr className="h-3" key={"space2"}></tr>
        <tr key={"footer"}>
          <td>
            <Footer />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
