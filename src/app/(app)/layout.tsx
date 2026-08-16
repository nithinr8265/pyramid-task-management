"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { SidebarCollapsedContext } from "@/hooks/useSidebarCollapsed";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { session, hydrated } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    STORAGE_KEYS.sidebarCollapsed,
    false
  );

  useEffect(() => {
    if (hydrated && !session) router.replace("/login");
  }, [hydrated, session, router]);

  if (!hydrated || !session) {
    return <div className="flex-1 bg-surface" />;
  }

  return (
    <SidebarCollapsedContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex-1 flex min-h-screen bg-surface text-text">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      </div>
    </SidebarCollapsedContext.Provider>
  );
}
