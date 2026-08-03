/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProfileDetailsType } from "@/lib/validators/user-schemas";

export function pickDirtyValues(dirtyFields: any, values: any): any {
  if (dirtyFields === true) return values;
  if (typeof dirtyFields !== "object" || dirtyFields === null) return undefined;

  const result: any = {};
  for (const key in dirtyFields) {
    const picked = pickDirtyValues(dirtyFields[key], values?.[key]);
    if (picked !== undefined) result[key] = picked;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

// Shallow-per-group deep merge for the links jsonb blob
export function deepMerge(base: any, patch: any): any {
  if (!patch) return base;
  const out = { ...base };
  for (const key in patch) {
    if (
      patch[key] !== null &&
      typeof patch[key] === "object" &&
      !Array.isArray(patch[key])
    ) {
      out[key] = deepMerge(base?.[key] ?? {}, patch[key]);
    } else {
      out[key] = patch[key];
    }
  }
  return out;
}

/**
 * Builds the profiles update payload from the form's dirty fields.
 * Returns `null` when nothing actually changed.
 */
export function buildProfileUpdate({
  id,
  links,
  dirtyFields,
  values,
  avatarUrl,
  avatarChanged,
}: {
  id?: string;
  links?: any;
  dirtyFields: any;
  values: ProfileDetailsType;
  avatarUrl?: string;
  avatarChanged: boolean;
}): Record<string, any> | null {
  const dirtyValues = pickDirtyValues(dirtyFields, values) ?? {};

  // Deep-convert null → "" so empty fields save as empty strings, not null.
  const nullToEmpty = (obj: any): any => {
    if (obj === null) return "";
    if (Array.isArray(obj)) return obj.map(nullToEmpty);
    if (typeof obj === "object") {
      const res: Record<string, any> = {};
      for (const key in obj) res[key] = nullToEmpty(obj[key]);
      return res;
    }
    return obj;
  };
  const cleanedDirty = nullToEmpty(dirtyValues);

  const { fullname, username, about, avatar, ...dirtyLinkGroups } = cleanedDirty;

  const payload: Record<string, any> = { id };
  if (fullname !== undefined) payload.fullname = fullname;
  if (username !== undefined) payload.username = username;
  if (about !== undefined) payload.about = about;
  if (avatarChanged) payload.avatar = avatarUrl;
  else if (avatar !== undefined) payload.avatar = avatar;

  if (Object.keys(dirtyLinkGroups).length > 0) {
    payload.links = deepMerge(links ?? {}, dirtyLinkGroups);
  }

  // Only the id present (and no new avatar) means there's nothing to save.
  if (Object.keys(payload).length === 1 && !avatarChanged) {
    return null;
  }

  return payload;
}