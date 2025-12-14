"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function CreativeInputs() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6 my-3">
      <FormField
        control={form.control}
        name="creative.behance"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Behance</FormLabel>
            <FormControl>
              <Input placeholder="https://www.behance.net/..." {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="creative.dribbble"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Dribbble</FormLabel>
            <FormControl>
              <Input placeholder="https://www.dribbble.com/..." {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
