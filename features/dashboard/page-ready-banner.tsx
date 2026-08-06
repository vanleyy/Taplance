"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Success banner shown on the dashboard once a username exists, with the
 * public page URL and a one-click copy button.
 */
export function PageReadyBanner({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `/${username}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      // Fallback for non-secure contexts where navigator.clipboard is absent.
      const textarea = document.createElement("textarea");
      textarea.value = pageUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-lg border border-green-200 dark:border-green-800/60 bg-green-50 dark:bg-green-950/40 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <span className="mt-0.5 sm:mt-0 size-9 shrink-0 rounded-full bg-green-100 dark:bg-green-900/60 text-green-600 dark:text-green-400 flex items-center justify-center">
          <PartyPopper className="size-4" />
        </span>
        <div className="min-w-0">
          <h4 className="font-bold text-sm sm:text-base">
            Congrats {username}! Your page is ready!
          </h4>
          <Link
            href={`/${username}`}
            title={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block max-w-full truncate text-xs text-green-700 dark:text-green-500 underline underline-offset-2 hover:text-green-800 dark:hover:text-green-400"
          >
            {pageUrl}
          </Link>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copy}
        className="shrink-0 self-start sm:self-auto"
      >
        {copied ? <Check className="text-green-600" /> : <Copy />}
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
