/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ProfileDetailsSchema,
  ProfileDetailsType,
} from "@/lib/validators/user-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import imageCompression from "browser-image-compression";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useProfile } from "@/lib/context/profile-context";
import { getUserProfile } from "@/lib/queries/users";
import { TabsTriggers } from "@/features/dashboard/tabs-triggers";
import { TabsContents } from "@/features/dashboard/tabs-content";
import Link from "next/link";
import { deepMerge, pickDirtyValues } from "@/lib/helpers/dirty-fields";
import { sanitizeUsername } from "@/features/dashboard/inputs/handle-input";

type Links = {
  social: { instagram: string; twitter: string };
  creative: { behance: string; dribbble: string };
  messaging: { whatsapp: string; telegram: string };
  storefront: { shopify: string; etsy: string };
  professional: { linkedin: string; portfolio: string };
  miscellaneous: { custom: string };
};

const DashboardPage = () => {
  const supabase = createClient();
  const [selectedAvatar, setSelectedAvatar] = React.useState<File | null>(null);
  const { userId } = useProfile();

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
      avatar: "https://github.com/shadcn.png",
      social: { instagram: "", twitter: "" },
      professional: { linkedin: "", portfolio: "" },
      creative: { behance: "", dribbble: "" },
      messaging: { whatsapp: "", telegram: "" },
      storefront: { shopify: "", etsy: "" },
      miscellaneous: { custom: "" },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setNestedFormValues(form: any, prefix: string, obj: any) {
    Object.entries(obj).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        setNestedFormValues(form, path, value);
      } else {
        form.setValue(path, value);
      }
    });
  }

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

  form.reset({
    fullname: data.fullname ?? "",
    username: data.username ?? "",
    avatar: data.avatar ?? "",
    about: data.about ?? "",
    ...links,
  });
}, [data]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedAvatar(file);
    const previewUrl = URL.createObjectURL(file);
    form.setValue("avatar", previewUrl);
  }

async function onSubmit(values: ProfileDetailsType) {
  const dirtyFields = form.formState.dirtyFields;

  let avatarUrl: string | undefined;
  const avatarChanged = Boolean(selectedAvatar);

  if (selectedAvatar) {
    if (selectedAvatar.size > 5 * 1024 * 1024) {
      return toast.error("Image too large");
    }
    const compressedAvatar = await imageCompression(selectedAvatar, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: "image/webp",
    });

    const fileName = `${data?.id}.webp`;
    const { data: uploadData, error } = await supabase.storage
      .from("public-avatars")
      .upload(fileName, compressedAvatar, {
        upsert: true,
        contentType: "image/webp",
      });

    if (error) {
      toast.error("Failed to upload avatar");
      return;
    }

    avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-avatars/${uploadData.path}`;
  }

  // Only pull out fields that actually changed
  const dirtyValues = pickDirtyValues(dirtyFields, values) ?? {};

  const nullToEmpty = (obj: any): any => {
    if (obj === null) return "";
    if (Array.isArray(obj)) return obj.map(nullToEmpty);
    if (typeof obj === "object") {
      const res: any = {};
      for (const key in obj) res[key] = nullToEmpty(obj[key]);
      return res;
    }
    return obj;
  };
  const cleanedDirty = nullToEmpty(dirtyValues);

  const { fullname, username, about, avatar, ...dirtyLinkGroups } = cleanedDirty;

  const hasDirtyLinks = Object.keys(dirtyLinkGroups).length > 0;

  const payload: Record<string, any> = { id: data?.id };
  if (fullname !== undefined) payload.fullname = fullname;
  if (username !== undefined) payload.username = username;
  if (about !== undefined) payload.about = about;
  if (avatarChanged) payload.avatar = avatarUrl;
  else if (avatar !== undefined) payload.avatar = avatar;

  if (hasDirtyLinks) {
    payload.links = deepMerge(data?.links ?? {}, dirtyLinkGroups);
  }

  // Nothing to save
  if (Object.keys(payload).length === 1 && !avatarChanged) {
    toast.message("No changes to save");
    return;
  }

  try {
    await update(payload);
    // Re-baseline so subsequent edits are compared against what we just saved
    form.reset(values, { keepValues: true, keepDirty: false });
  } catch {
    toast.error("Profile update failed");
  }
}

  const onError = (error: FieldErrors<ProfileDetailsType>) => {
    console.log(error)
    toast.error("Please fix the highlighted fields.");}

  return (
    <div className="flex flex-col justify-center items-center gap-5 px-4 sm:px-6 lg:mx-28 mb-10">
      <div className="flex justify-center items-center w-full">
        {data?.links && (
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
            <div className="flex flex-col justify-center items-center text-center">
              <label htmlFor="avatarUpload" className="cursor-pointer">
                <Avatar className="w-20 h-20 hover:opacity-80 transition">
                  {data?.avatar && <AvatarImage src={form.watch("avatar")} />}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </label>

              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />

              <p className="text-sm">Profile Image</p>
              <p className="text-xs">Click the image to change*</p>
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        // Only letters/numbers — the username is part of the
                        // public URL path (/{username}).
                        e.target.value = sanitizeUsername(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>fullname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>about</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
