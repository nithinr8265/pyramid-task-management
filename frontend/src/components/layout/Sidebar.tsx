"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, ClipboardList, FolderClosed } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { Avatar } from "@/components/ui/Avatar";
import { AccountMenu } from "@/components/layout/AccountMenu";

const NAV_ITEMS = [
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/projects", label: "Projects", icon: FolderClosed },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { session } = useAuth();
  const { setCollapsed } = useSidebarCollapsed();
  const pathname = usePathname();

  if (collapsed) return null;

  function handleNavigate() {
    // On small screens the sidebar is an overlay drawer — close it after
    // navigating so it doesn't cover the page. Desktop keeps it open.
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setCollapsed(true);
    }
  }

  return (
    <>
      {/* Backdrop — mobile/tablet only, closes the drawer on tap */}
      <div
        className="fixed inset-0 z-30 bg-black/30 md:hidden"
        onClick={() => setCollapsed(true)}
        aria-hidden="true"
      />
      <aside className="fixed inset-y-0 left-0 z-40 w-[240px] shrink-0 h-full border-r border-border bg-surface flex flex-col md:static md:z-auto">
        <div className="p-3">
          <AccountMenu
            trigger={({ open, toggle }) => (
              <button
                onClick={toggle}
                aria-expanded={open}
                className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-hover transition-colors text-left"
              >
                <Avatar member={session?.user} size="sm" />
                <span className="flex-1 text-sm font-medium truncate">
                  {session?.user.name ?? "Account"}
                </span>
                <ChevronsUpDown size={14} className="text-text-subtle shrink-0" />
              </button>
            )}
          />
        </div>

        <nav className="px-3 pb-3 flex-1 overflow-y-auto scrollbar-thin">
          <p className="px-2 pb-1.5 text-xs font-medium text-text-subtle flex items-center justify-between">
            Workspace
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavigate}
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-surface-muted font-medium text-text"
                        : "text-text-muted hover:bg-surface-hover hover:text-text"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
