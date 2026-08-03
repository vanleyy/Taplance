"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { HandleInput } from "./handle-input";

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
              <HandleInput
                placeholder="username"
                baseDomain="behance.net"
                prefix="behance.net/"
                {...field}
              />
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
              <HandleInput
                placeholder="username"
                baseDomain="dribbble.com"
                prefix="dribbble.com/"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
