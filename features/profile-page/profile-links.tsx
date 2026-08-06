import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  url: string;
}

/**
 * A single link on the public profile page — rendered as a full-width card
 * with the icon on the left, a centered label, and a chevron on the right.
 */
export default function LinkCard({ icon, label, url }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/60"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        {icon}
      </span>

      <span className="flex-1 truncate text-center text-sm font-medium sm:text-base">
        {label}
      </span>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </a>
  );
}
