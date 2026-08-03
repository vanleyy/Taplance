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

export default function ProfessionalInputs() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6 my-3">
      <FormField
        control={form.control}
        name="professional.linkedin"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">LinkedIn</FormLabel>
            <FormControl>
              <HandleInput
                placeholder="username"
                baseDomain="linkedin.com"
                prefix="linkedin.com/in/"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="professional.portfolio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Portfolio Website</FormLabel>
            <FormControl>
              <Input placeholder="https://your-portfolio.com" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
