export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path d="M12 2 L22 20 L2 20 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      {withWordmark && <span className="font-semibold text-[15px]">Pyramid</span>}
    </span>
  );
}
