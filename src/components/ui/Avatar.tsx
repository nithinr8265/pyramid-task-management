import { Member } from "@/types";

const SIZES = {
  xs: "w-5 h-5 text-[10px]",
  sm: "w-6 h-6 text-[11px]",
  md: "w-8 h-8 text-xs",
  lg: "w-16 h-16 text-xl",
};

export function Avatar({
  member,
  size = "sm",
  className = "",
}: {
  member: Pick<Member, "initials" | "color" | "name"> | null | undefined;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (!member) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-surface-muted text-text-subtle border border-border shrink-0 ${SIZES[size]} ${className}`}
        aria-hidden="true"
      >
        +
      </span>
    );
  }
  return (
    <span
      title={member.name}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br ${member.color} text-white font-medium shrink-0 ${SIZES[size]} ${className}`}
    >
      {member.initials}
    </span>
  );
}

export function AvatarStack({
  members,
  max = 3,
  size = "sm",
}: {
  members: (Member | undefined)[];
  max?: number;
  size?: keyof typeof SIZES;
}) {
  const shown = members.filter(Boolean).slice(0, max) as Member[];
  const overflow = members.filter(Boolean).length - shown.length;
  if (shown.length === 0) {
    return <Avatar member={null} size={size} />;
  }
  return (
    <span className="flex items-center -space-x-1.5">
      {shown.map((m) => (
        <Avatar key={m.id} member={m} size={size} className="ring-2 ring-surface" />
      ))}
      {overflow > 0 && (
        <span
          className={`inline-flex items-center justify-center rounded-full bg-surface-muted text-text-muted font-medium ring-2 ring-surface ${SIZES[size]}`}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}
