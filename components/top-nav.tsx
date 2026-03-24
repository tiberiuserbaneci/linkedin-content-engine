"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/infographics", label: "Infographics" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="h-11 border-b border-[#1E1E1E] bg-[#0A0A0A] flex items-center px-5 gap-6 shrink-0">
      <span className="text-[13px] font-semibold text-[#F1F1F1] mr-4 tracking-tight">
        LinkedIn Content Engine
      </span>
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-[12px] font-medium transition-colors ${
              active
                ? "text-[#DA4E24]"
                : "text-[#666] hover:text-[#999]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
