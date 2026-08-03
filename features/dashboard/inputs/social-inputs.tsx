"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { HandleInput } from "./handle-input";

export default function SocialInputs() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6 my-3">
      <FormField
        control={form.control}
        name="social.instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Instagram</FormLabel>
            <FormControl>
              <HandleInput
                placeholder="username"
                baseDomain="instagram.com"
                prefix="instagram.com/"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="social.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Twitter / X</FormLabel>
            <FormControl>
              <HandleInput
                placeholder="username"
                baseDomain="x.com"
                prefix="x.com/"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
