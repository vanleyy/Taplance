"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

// Characters allowed in a platform handle: letters, numbers, '_', '.', '-'.
const INVALID_HANDLE_CHARS = /[^a-zA-Z0-9_.-]/g;

// Reduce whatever the user types or pastes down to just a bare username.
// Example: "https://www.linkedin.com/in/johndoe" → "johndoe"
export function sanitizeHandle(
  raw: string,
  baseDomain?: string,
  handleIsSubdomain = false
): string {
  // Drop "?ref=..." / "#..." fragments — but only when they follow a valid
  // handle char, so a stray "#" in "foo#bar" can't erase the username.
  let value = raw.trim().replace(/([a-zA-Z0-9_.-])[?#].*$/, "$1");

  const isUrl = /^https?:\/\//i.test(value) || /^www\./i.test(value);

  if (isUrl) {
    try {
      const url = new URL(
        value.startsWith("http") ? value : `https://${value}`
      );
      const host = url.hostname.toLowerCase().replace(/^www\./, "");

      if (handleIsSubdomain && baseDomain && host.endsWith(`.${baseDomain}`)) {
        // "your-store.myshopify.com" → "your-store"
        value = host.slice(0, -baseDomain.length - 1);
      } else {
        // "linkedin.com/in/johndoe" → "johndoe" (last path segment)
        value = url.pathname.split("/").filter(Boolean).at(-1) ?? "";
      }
    } catch {
      // Not parseable as a URL — fall through to the string cleaning below.
    }
  }

  // Shopify-style "your-store.myshopify.com" pasted without a protocol.
  if (handleIsSubdomain && baseDomain && !isUrl) {
    const escaped = baseDomain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = value.match(
      new RegExp(
        `^(?:https?:\\/\\/)?(?:www\\.)?([a-z0-9][a-z0-9-]*)(?:\\.${escaped})`,
        "i"
      )
    );
    if (match) value = match[1] ?? "";
  }

  // A bare "baseDomain/…" prefix (pasted without the protocol).
  if (baseDomain) {
    const escaped = baseDomain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    value = value.replace(
      new RegExp(`^(?:https?:\\/\\/)?(?:www\\.)?${escaped}\\/?`, "i"),
      ""
    );
  }

  // Keep only the last "/"-separated piece ("instagram.com/johndoe" → "johndoe").
  if (value.includes("/")) {
    value = value.split("/").filter(Boolean).at(-1) ?? "";
  }

  // Drop a leading "@" and anything not allowed (including spaces).
  return value.replace(/^@+/, "").replace(INVALID_HANDLE_CHARS, "");
}

// Sanitizer for the profile's own username (used in the public URL path).
export function sanitizeUsername(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

interface HandleInputProps extends React.ComponentProps<"input"> {
  /** Platform domain, used to strip pasted full URLs ("instagram.com"). */
  baseDomain?: string;
  /** True when the handle is the URL's subdomain (Shopify store names). */
  handleIsSubdomain?: boolean;
  /** Static text shown inside the input before the username. */
  prefix?: string;
  /** Static text shown inside the input after the username. */
  suffix?: string;
}

export function HandleInput({
  baseDomain,
  handleIsSubdomain,
  prefix,
  suffix,
  style,
  onChange,
  ...props
}: HandleInputProps) {
  const prefixRef = React.useRef<HTMLSpanElement>(null);
  const suffixRef = React.useRef<HTMLSpanElement>(null);
  const [prefixWidth, setPrefixWidth] = React.useState(0);
  const [suffixWidth, setSuffixWidth] = React.useState(0);

  // Measure the static prefix/suffix so the input text starts right after it.
  // Runs after paint (no SSR warning); prefixes are static per field so the
  // padding never needs re-measuring once set.
  React.useEffect(() => {
    setPrefixWidth(prefixRef.current?.offsetWidth ?? 0);
    setSuffixWidth(suffixRef.current?.offsetWidth ?? 0);
  }, [prefix, suffix]);

  return (
    <div className="relative">
      {prefix && (
        <span
          ref={prefixRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-sm text-muted-foreground"
        >
          {prefix}
        </span>
      )}
      {suffix && (
        <span
          ref={suffixRef}
          className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-sm text-muted-foreground"
        >
          {suffix}
        </span>
      )}
      <Input
        {...props}
        style={{
          paddingLeft: prefix ? prefixWidth : undefined,
          paddingRight: suffix ? suffixWidth : undefined,
          ...style,
        }}
        onChange={(e) => {
          const cleaned = sanitizeHandle(
            e.target.value,
            baseDomain,
            handleIsSubdomain
          );
          if (cleaned !== e.target.value) e.target.value = cleaned;
          onChange?.(e);
        }}
      />
    </div>
  );
}
