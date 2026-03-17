"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/members", label: "成員", icon: "🧑‍🤝‍🧑" },
  { href: "/expenses", label: "支出", icon: "📒" },
  { href: "/result", label: "結算", icon: "✨" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
      <div className="card flex items-center justify-between px-3 py-2">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-0.5 text-xs ${
                active
                  ? "text-spriteText font-semibold"
                  : "text-spriteText/60"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

