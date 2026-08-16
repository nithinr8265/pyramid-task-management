"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-t border-border first:border-t-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-text-subtle mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ProfileSettingsPage() {
  const { session, logout } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(session?.user.name ?? "");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <div className="rounded-2xl border border-border px-5">
        <Field label="Profile picture">
          <Avatar member={session?.user} size="lg" />
        </Field>
        <Field label="Email">
          <span className="inline-flex items-center gap-2 text-sm text-text-muted">
            {session?.user.email}
            <button className="text-text-subtle hover:text-text" aria-label="Edit email">
              <Pencil size={13} />
            </button>
          </span>
        </Field>
        <Field label="Full name">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-9 w-48 px-3 rounded-lg border border-border-strong bg-surface-subtle text-sm text-right outline-none focus-visible:outline-2"
          />
        </Field>
        <Field label="Title" hint="Your job title or role">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Designer"
            className="h-9 w-48 px-3 rounded-lg border border-border-strong bg-surface-subtle text-sm text-right outline-none placeholder:text-text-subtle focus-visible:outline-2"
          />
        </Field>
        <Field label="Username" hint="One word, like a nickname or first name">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Dexuser"
            className="h-9 w-48 px-3 rounded-lg border border-border-strong bg-surface-subtle text-sm text-right outline-none placeholder:text-text-subtle focus-visible:outline-2"
          />
        </Field>
      </div>

      <h2 className="text-sm font-semibold mt-8 mb-3">Workspace access</h2>
      <div className="rounded-2xl border border-border px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text-muted">
            Remove yourself from the workspace
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="h-9 px-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors dark:bg-red-950 dark:text-red-300"
        >
          Leave Workspace
        </button>
      </div>
    </div>
  );
}
