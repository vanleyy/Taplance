"use client";

import { LinkField } from "./link-field";

export default function SocialInputs() {
  return (
    <div className="flex flex-col gap-6 my-3">
      <LinkField
        name="social.instagram"
        label="Instagram"
        baseDomain="instagram.com"
        prefix="instagram.com/"
      />
      <LinkField
        name="social.twitter"
        label="Twitter / X"
        baseDomain="x.com"
        prefix="x.com/"
      />
    </div>
  );
}
