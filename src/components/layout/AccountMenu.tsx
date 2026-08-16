"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  LogOut,
  Moon,
  Palette,
  Settings,
  Sun,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ACCENT_OPTIONS, useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/ui/Avatar";
import { Popover } from "@/components/ui/Popover";

function MenuItem({
  icon,
  label,
  onClick,
  submenu,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  submenu?: ReactNode;
  danger?: boolean;
}) {
  const [subOpen, setSubOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => submenu && setSubOpen(true)}
      onMouseLeave={() => submenu && setSubOpen(false)}
    >
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors hover:bg-surface-hover ${
          danger ? "text-red-500" : "text-text"
        }`}
      >
        <span className="text-text-muted shrink-0">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {submenu && <ChevronRight size={14} className="text-text-subtle" />}
      </button>
      {submenu && subOpen && (
        <div className="absolute left-full top-0 ml-1 w-44 rounded-lg border border-border bg-surface shadow-lg p-1.5 popover-in">
          {submenu}
        </div>
      )}
    </div>
  );
}

export function AccountMenu({
  trigger,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
}) {
  const { session, logout } = useAuth();
  const { mode, accent, setMode, setAccent } = useTheme();
  const router = useRouter();

  return (
    <Popover trigger={trigger} className="w-60">
      {(close) => (
        <div className="rounded-xl border border-border bg-surface shadow-lg p-1.5">
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <Avatar member={session?.user} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user.name}
              </p>
              <p className="text-xs text-text-subtle truncate">
                {session?.user.email}
              </p>
            </div>
          </div>
          <div className="h-px bg-border my-1" />

          <MenuItem
            icon={<Sun size={15} />}
            label="Change Theme"
            submenu={
              <div className="flex flex-col gap-0.5">
                <p className="px-2 py-1 text-xs text-text-subtle">Theme</p>
                <button
                  onClick={() => setMode("light")}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
                >
                  <Sun size={14} className="text-text-muted" />
                  <span className="flex-1 text-left">Light</span>
                  {mode === "light" && <Check size={14} />}
                </button>
                <button
                  onClick={() => setMode("dark")}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
                >
                  <Moon size={14} className="text-text-muted" />
                  <span className="flex-1 text-left">Dark</span>
                  {mode === "dark" && <Check size={14} />}
                </button>
              </div>
            }
          />

          <MenuItem
            icon={<Palette size={15} />}
            label="Color Mode"
            submenu={
              <div className="flex flex-col gap-0.5">
                <p className="px-2 py-1 text-xs text-text-subtle">
                  Color Mode
                </p>
                {ACCENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAccent(opt.id)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-[4px] shrink-0"
                      style={{ background: opt.swatch }}
                    />
                    <span className="flex-1 text-left">{opt.label}</span>
                    {accent === opt.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            }
          />

          <MenuItem
            icon={<Settings size={15} />}
            label="Settings"
            onClick={() => {
              close();
              router.push("/settings");
            }}
          />

          <div className="h-px bg-border my-1" />
          <MenuItem
            icon={<LogOut size={15} />}
            label="Log out"
            danger
            onClick={() => {
              close();
              logout();
              router.push("/login");
            }}
          />
        </div>
      )}
    </Popover>
  );
}
