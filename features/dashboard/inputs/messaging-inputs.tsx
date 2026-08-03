"use client";

import { LinkField } from "./link-field";

export default function MessagingInputs() {
  return (
    <div className="flex flex-col gap-6 my-3">
      <LinkField
        name="messaging.whatsapp"
        label="WhatsApp"
        kind="phone"
        placeholder="+213..."
      />
      <LinkField
        name="messaging.telegram"
        label="Telegram"
        baseDomain="t.me"
        prefix="t.me/"
      />
    </div>
  );
}
