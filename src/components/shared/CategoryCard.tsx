import Link from "next/link";
import type { ReactNode } from "react";

export default function CategoryCard({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 text-center text-xs font-semibold transition hover:-translate-y-0.5"
    >
      <span className="flex h-20 w-full items-center justify-center rounded-xl border border-black/5 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
        {icon}
      </span>
      {label}
    </Link>
  );
}
