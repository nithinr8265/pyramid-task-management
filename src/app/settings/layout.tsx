"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Palette, Search, Sun, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { href: "/settings", label: "Profile", icon: User },
  { href: "/settings/theme", label: "Theme", icon: Sun },
  { href: "/settings/color", label: "Color", icon: Palette },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !session) router.replace("/login");
  }, [hydrated, session, router]);

  if (!hydrated || !session) {
    return <div className="flex-1 bg-surface" />;
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-surface text-text">
      <aside className="w-full md:w-[220px] shrink-0 border-b md:border-b-0 md:border-r border-border p-3 flex flex-col gap-4">
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text px-1"
        >
          <ArrowLeft size={14} />
          Back to app
        </Link>

        <div className="flex items-center gap-2 h-9 px-2.5 rounded-lg border border-border bg-surface-subtle text-text-subtle">
          <Search size={14} />
          <span className="text-sm">Search</span>
        </div>

        <nav>
          <ul className="flex md:flex-col gap-0.5 overflow-x-auto scrollbar-thin">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors whitespace-nowrap ${
                      active
                        ? "bg-surface-muted font-medium text-text"
                        : "text-text-muted hover:bg-surface-hover hover:text-text"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-6 md:px-10 py-8 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
