/* eslint-disable @typescript-eslint/no-explicit-any */

import { JSX } from "react";
import { Link } from "lucide-react";

// Builds the full URL for platform links that are stored as bare handles
// (the dashboard lets users enter just their username). Fields not listed
// here (portfolio, custom) pass their stored value through untouched.
const handleToUrl: Record<string, (handle: string) => string> = {
  instagram: (h) => `https://instagram.com/${h}`,
  twitter: (h) => `https://x.com/${h}`,
  linkedin: (h) => `https://www.linkedin.com/in/${h}`,
  behance: (h) => `https://www.behance.net/${h}`,
  dribbble: (h) => `https://dribbble.com/${h}`,
  telegram: (h) => `https://t.me/${h}`,
  shopify: (h) => `https://${h}.myshopify.com`,
  etsy: (h) => `https://www.etsy.com/shop/${h}`,
  whatsapp: (h) => `https://wa.me/${h.replace(/^\+/, "")}`,
};

function resolveUrl(key: string, raw: string): string {
  // Already a full URL (legacy rows, portfolio, custom links) — use as-is.
  if (/^https?:\/\//i.test(raw)) return raw;

  const build = handleToUrl[key];
  if (build) return build(raw.replace(/^@/, ""));

  return raw;
}

export function flattenLinks(
  obj: Record<string, any>,
  iconMap: Record<string, JSX.Element>
) {
  const result: { label: string; icon: JSX.Element; url: string }[] = [];

  function traverse(node: Record<string, any>) {
    Object.entries(node).forEach(([key, value]) => {
      if (typeof value === "string" && value) {
        result.push({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          icon: iconMap[key] || <Link size={20} />,
          url: resolveUrl(key, value),
        });
      } else if (typeof value === "object" && value !== null) {
        traverse(value);
      }
    });
  }

  traverse(obj);

  return result;
}
