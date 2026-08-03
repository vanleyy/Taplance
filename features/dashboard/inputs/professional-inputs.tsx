"use client";

import { LinkField } from "./link-field";

export default function ProfessionalInputs() {
  return (
    <div className="flex flex-col gap-6 my-3">
      <LinkField
        name="professional.linkedin"
        label="LinkedIn"
        baseDomain="linkedin.com"
        prefix="linkedin.com/in/"
      />
      <LinkField
        name="professional.portfolio"
        label="Portfolio Website"
        kind="url"
        placeholder="https://your-portfolio.com"
      />
    </div>
  );
}
