import { getCurrentUser } from "@/lib/api";

export default async function AskPage() {
  const user = await getCurrentUser();

  return <div>ask</div>;
}
