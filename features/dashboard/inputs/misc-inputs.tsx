"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function MiscInputs() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6 my-3">
      <FormField
        control={form.control}
        name="miscellaneous.custom"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Custom Link</FormLabel>
            <FormControl>
              <Input placeholder="Any custom link..." {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
