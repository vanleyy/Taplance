"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useUpdateMutation } from "@supabase-cache-helpers/postgrest-swr";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { useProfile } from "@/lib/context/profile-context";
import { getUserProfile } from "@/lib/queries/users";
import {
  ProfileDetailsSchema,
  ProfileDetailsType,
} from "@/lib/validators/user-schemas";
import { buildProfileUpdate, deepMerge } from "@/lib/helpers/dirty-fields";
import { TabsTriggers } from "@/features/dashboard/tabs-triggers";
import { TabsContents } from "@/features/dashboard/tabs-content";
import { BasicFields } from "@/features/dashboard/basic-fields";
import { useAvatarUpload } from "@/features/dashboard/hooks/use-avatar-upload";

type Links = {
  social: { instagram: string; twitter: string };
  creative: { behance: string; dribbble: string };
  messaging: { whatsapp: string; telegram: string };
  storefront: { shopify: string; etsy: string };
  professional: { linkedin: string; portfolio: string };
  miscellaneous: { custom: string };
};

// Placeholder stored at signup — treated as "no avatar" so the OAuth picture
// is used as the default until the user uploads their own.
const FALLBACK_AVATAR = "https://github.com/shadcn.png";

const DashboardPage = () => {
  const supabase = createClient();
  const { userId } = useProfile();
  const [oauthAvatar, setOauthAvatar] = useState("");

  const { data } = useQuery(getUserProfile(userId));

  const { trigger: update } = useUpdateMutation(
    supabase.from("profiles"),
    ["id"],
    "*",
    {
      onSuccess: () => toast.success("Your changes have been saved!"),
      onError: (error) => {
        if (
          error?.message?.includes("profiles_username_key") ||
          error?.code === "23505"
        ) {
          toast.error("This username is already taken");
        } else {
          toast.error("Failed to save changes");
        }
      },
    }
  );

  const form = useForm<ProfileDetailsType>({
    resolver: zodResolver(ProfileDetailsSchema),
    defaultValues: {
      username: "",
      fullname: "",
      about: "",
      avatar: "",
      social: { instagram: "", twitter: "" },
      professional: { linkedin: "", portfolio: "" },
      creative: { behance: "", dribbble: "" },
      messaging: { whatsapp: "", telegram: "" },
      storefront: { shopify: "", etsy: "" },
      miscellaneous: { custom: "" },
    },
  });

  const { selectedAvatar, onAvatarChange, uploadAvatar } = useAvatarUpload(
    (url) => form.setValue("avatar", url)
  );

  // Show the OAuth provider picture as the default avatar until the user
  // uploads their own.
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const url = data.user?.user_metadata?.avatar_url;
      if (typeof url === "string") setOauthAvatar(url);
    });
    return () => {
      active = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!data) return;

    // Merge stored links over the empty defaults so a partial/legacy "links"
    // row never drops a group (which would make zod reject the form on submit).
    const emptyLinks: Links = {
      social: { instagram: "", twitter: "" },
      professional: { linkedin: "", portfolio: "" },
      creative: { behance: "", dribbble: "" },
      messaging: { whatsapp: "", telegram: "" },
      storefront: { shopify: "", etsy: "" },
      miscellaneous: { custom: "" },
    };
    const links = deepMerge(emptyLinks, data.links ?? {});

    // A signup placeholder counts as "no avatar" — default to the OAuth picture.
    const storedAvatar =
      data.avatar && data.avatar !== FALLBACK_AVATAR ? data.avatar : "";

    form.reset({
      fullname: data.fullname ?? "",
      username: data.username ?? "",
      avatar: storedAvatar || oauthAvatar,
      about: data.about ?? "",
      ...links,
    });
  }, [data, form, oauthAvatar]);

  const onError = (error: FieldErrors<ProfileDetailsType>) => {
    console.log(error);
    toast.error("Please fix the highlighted fields.");
  };

  async function onSubmit(values: ProfileDetailsType) {
    // Upload a newly-selected avatar before saving the profile.
    let avatarUrl: string | undefined;
    if (selectedAvatar) {
      try {
        avatarUrl = await uploadAvatar(data?.id ?? "");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload avatar"
        );
        return;
      }
    }

    // Only pull out fields that actually changed
    const payload = buildProfileUpdate({
      id: data?.id,
      links: data?.links,
      dirtyFields: form.formState.dirtyFields,
      values,
      avatarUrl,
      avatarChanged: Boolean(selectedAvatar),
    });

    // Nothing to save
    if (!payload) {
      toast.message("No changes to save");
      return;
    }

    try {
      await update(payload);
      // Re-baseline so subsequent edits are compared against what we just saved
      form.reset(values, { keepValues: true, keepDirty: false });
    } catch {
      // The mutation's onError already surfaced the right message
      // ("username already taken" / "Failed to save changes").
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5 px-4 sm:px-6 lg:mx-28 mb-10">
      <div className="flex justify-center items-center w-full">
        {data?.username && (
          <div className="w-full rounded px-4 sm:px-5 outline py-2">
            <h4 className="font-bold">
              Congrats {data.username}! your page is ready!
            </h4>
            <Link
              className="underline text-xs"
              href={data.username ? `/${data.username}` : "#"}
            >
              {typeof window !== "undefined"
                ? `${window.location.origin}/${data.username}`
                : `/${data.username}`}
            </Link>
          </div>
        )}
      </div>

      <div className="w-full sm:w-4/5 lg:w-2/3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className={cn("flex flex-col gap-6 w-full")}
          >
            <BasicFields onAvatarChange={onAvatarChange} />

            <h3 className="text-base font-bold">Manage</h3>

            <Tabs defaultValue="social" className="w-full">
              <TabsTriggers />
              <TabsContents />
            </Tabs>

            <Button type="submit" className="w-full sm:w-auto">
              save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DashboardPage;
