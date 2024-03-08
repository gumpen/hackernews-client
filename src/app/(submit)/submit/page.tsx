import { SubmitForm } from "@/components/submit-form";
import { getCurrentUser } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function SubmitPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return <SubmitForm></SubmitForm>;
}
