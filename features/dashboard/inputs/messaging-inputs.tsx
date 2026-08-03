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

export default function MessagingInputs() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6 my-3">
      <FormField
        control={form.control}
        name="messaging.whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">WhatsApp</FormLabel>
            <FormControl>
              <Input
                placeholder="+213..."
                {...field}
                onChange={(e) => {
                  // Only digits and one leading "+" — strips pasted spaces/dashes.
                  const raw = e.target.value.replace(/[^\d+]/g, "");
                  const plus = raw.startsWith("+") ? "+" : "";
                  e.target.value = plus + raw.replace(/\+/g, "");
                  field.onChange(e);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="messaging.telegram"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Telegram</FormLabel>
            <FormControl>
              <HandleInput
                placeholder="username"
                baseDomain="t.me"
                prefix="t.me/"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
