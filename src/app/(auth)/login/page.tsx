import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function Login() {
  const user = await getCurrentUser();
  if (user) {
    redirect(`/user?id=${user.id}`);
  }

  return <LoginForm />;
}
