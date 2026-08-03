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