import { UserForm } from "@/components/user-form";
import { getCurrentUser, getUserById } from "@/lib/api";

export default async function UserPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("UserPage");

  let paramsId = searchParams["id"];

  if (!paramsId) {
    return <div>no such user</div>;
  }
  if (Array.isArray(paramsId)) {
    paramsId = paramsId[0] as string;
  }
  const paramsUser = await getUserById(paramsId);
  if (!paramsUser) {
    return <div>no such user</div>;
  }
  const currentUser = await getCurrentUser();

  return (
    <UserForm currentUser={currentUser} displayUser={paramsUser}></UserForm>
  );
}
