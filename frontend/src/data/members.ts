import { Member } from "@/types";

// Realistic mock members. "guest" is added dynamically at runtime by
// useAuth() when someone continues as a guest, so it isn't listed here.
export const members: Member[] = [
  {
    id: "admin",
    name: "Admin",
    email: "admin@pyramid.app",
    initials: "A",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "dexter",
    name: "Dexter",
    email: "dexter@gmail.com",
    initials: "D",
    color: "from-fuchsia-500 to-indigo-500",
  },
  {
    id: "designer",
    name: "Designer",
    email: "designer@pyramid.app",
    initials: "DX",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "cn",
    name: "Chidi Nwosu",
    email: "chidi@pyramid.app",
    initials: "CN",
    color: "from-sky-500 to-cyan-500",
  },
  {
    id: "security",
    name: "Security Team",
    email: "security@pyramid.app",
    initials: "S",
    color: "from-slate-600 to-slate-800",
  },
  {
    id: "qa",
    name: "QA Team",
    email: "qa@pyramid.app",
    initials: "QA",
    color: "from-emerald-500 to-teal-500",
  },
];

export function getMemberById(id?: string): Member | undefined {
  if (!id) return undefined;
  return members.find((m) => m.id === id);
}
