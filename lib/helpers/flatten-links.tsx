/* eslint-disable @typescript-eslint/no-explicit-any */

import { JSX } from "react";
import {
  Facebook,
  Gamepad2,
  Instagram,
  Link,
  MessageCircle,
  Twitter,
} from "lucide-react";

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
          url: value,
        });
      } else if (typeof value === "object" && value !== null) {
        traverse(value);
      }
    });
  }

  traverse(obj);

  return result;
}
