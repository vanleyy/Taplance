"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { HandleInput } from "./handle-input";

export default function StorefrontInputs() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6 my-3">
      <FormField
        control={form.control}
        name="storefront.shopify"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Shopify Store</FormLabel>
            <FormControl>
              <HandleInput
                placeholder="your-store"
                baseDomain="myshopify.com"
                handleIsSubdomain
                suffix=".myshopify.com"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="storefront.etsy"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Etsy Store</FormLabel>
            <FormControl>
              <HandleInput
                placeholder="your-shop-name"
                baseDomain="etsy.com"
                prefix="etsy.com/shop/"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
