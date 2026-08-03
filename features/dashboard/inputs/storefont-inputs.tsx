"use client";

import { LinkField } from "./link-field";

export default function StorefrontInputs() {
  return (
    <div className="flex flex-col gap-6 my-3">
      <LinkField
        name="storefront.shopify"
        label="Shopify Store"
        baseDomain="myshopify.com"
        handleIsSubdomain
        suffix=".myshopify.com"
        placeholder="your-store"
      />
      <LinkField
        name="storefront.etsy"
        label="Etsy Store"
        baseDomain="etsy.com"
        prefix="etsy.com/shop/"
        placeholder="your-shop-name"
      />
    </div>
  );
}
