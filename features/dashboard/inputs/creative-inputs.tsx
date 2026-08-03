"use client";

import { LinkField } from "./link-field";

export default function CreativeInputs() {
  return (
    <div className="flex flex-col gap-6 my-3">
      <LinkField
        name="creative.behance"
        label="Behance"
        baseDomain="behance.net"
        prefix="behance.net/"
      />
      <LinkField
        name="creative.dribbble"
        label="Dribbble"
        baseDomain="dribbble.com"
        prefix="dribbble.com/"
      />
    </div>
  );
}
