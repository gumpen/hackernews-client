"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export const MoreTextButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams.toString());
  if (params.get("p")) {
    const n = Number(params.get("p"));
    params.set("p", String(n + 1));
  } else {
    params.set("p", "2");
  }

  const query = params.toString();
  const link = query ? `${pathname}?${query}` : pathname;

  return (
    <Link className="text-black text-sm" href={link}>
      More
    </Link>
  );
};
