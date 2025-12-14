"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
              <Input placeholder="+213..." {...field} />
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
              <Input placeholder="https://telegram.me/username" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
