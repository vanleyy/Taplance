"use client";

import { useCallback, useState } from "react";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";

/**
 * Owns the avatar file state and the Supabase Storage upload.
 *
 * `onAvatarChange` is wired to the hidden file input; it sets the file and
 * hands the browser preview URL to `onPreview` (the caller uses it to update
 * the form's `avatar` field so the preview shows immediately).
 *
 * `uploadAvatar(profileId)` is a no-op when no file was selected, throws on
 * size/upload failure (caller toasts the message and aborts the save), and
 * otherwise returns the public Storage URL.
 */
export function useAvatarUpload(onPreview: (previewUrl: string) => void) {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const onAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSelectedAvatar(file);
      onPreview(URL.createObjectURL(file));
    },
    [onPreview]
  );

  const uploadAvatar = useCallback(async (profileId: string) => {
    if (!selectedAvatar) return undefined;

    if (selectedAvatar.size > 5 * 1024 * 1024) {
      throw new Error("Image too large");
    }

    const compressedAvatar = await imageCompression(selectedAvatar, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: "image/webp",
    });

    const supabase = createClient();
    const fileName = `${profileId}.webp`;
    const { data: uploadData, error } = await supabase.storage
      .from("public-avatars")
      .upload(fileName, compressedAvatar, {
        upsert: true,
        contentType: "image/webp",
      });

    if (error) {
      throw new Error("Failed to upload avatar");
    }

    // Cache-busting query param: the object path is fixed per profile, so the
    // URL would otherwise never change and browsers/CDNs would keep serving the
    // stale image after a re-upload. A fresh URL on every upload forces a refetch.
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-avatars/${uploadData.path}?v=${Date.now()}`;
  }, [selectedAvatar]);

  return { selectedAvatar, onAvatarChange, uploadAvatar };
}
