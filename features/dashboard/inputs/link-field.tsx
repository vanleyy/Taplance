"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HandleInput } from "./handle-input";

interface LinkFieldProps {
  name: string;
  label: string;
  /** handle = username-only input (default), url = full URL, phone = digits + leading "+". */
  kind?: "handle" | "url" | "phone";
  placeholder?: string;
  baseDomain?: string;
  prefix?: string;
  suffix?: string;
  handleIsSubdomain?: boolean;
}

/**
 * Shared field renderer for the link tabs. Replaces the repeated
 * FormField/FormItem/FormLabel/FormControl boilerplate across the six
 * tab input components.
 */
export function LinkField({
  name,
  label,
  kind = "handle",
  placeholder,
  baseDomain,
  prefix,
  suffix,
  handleIsSubdomain,
}: LinkFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-light">{label}</FormLabel>
          <FormControl>
            {kind === "url" ? (
              <Input placeholder={placeholder} {...field} />
            ) : kind === "phone" ? (
              <Input
                placeholder={placeholder}
                {...field}
                onChange={(e) => {
                  // Only digits and one leading "+" — strips pasted spaces/dashes.
                  const raw = e.target.value.replace(/[^\d+]/g, "");
                  const plus = raw.startsWith("+") ? "+" : "";
                  e.target.value = plus + raw.replace(/\+/g, "");
                  field.onChange(e);
                }}
              />
            ) : (
              <HandleInput
                placeholder={placeholder}
                baseDomain={baseDomain}
                prefix={prefix}
                suffix={suffix}
                handleIsSubdomain={handleIsSubdomain}
                {...field}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}
