"use client";

import { LinkField } from "./link-field";

export default function MiscInputs() {
  return (
    <div className="flex flex-col gap-6 my-3">
      <LinkField
        name="miscellaneous.custom"
        label="Custom Link"
        kind="url"
        placeholder="Any custom link..."
      />
    </div>
  );
}
