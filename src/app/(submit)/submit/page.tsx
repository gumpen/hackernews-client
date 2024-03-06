import { SubmitForm } from "@/components/submit-form";
import { getCurrentUser } from "@/lib/api";

export default async function SubmitPage() {
  const user = await getCurrentUser();
  return <SubmitForm></SubmitForm>;
}
