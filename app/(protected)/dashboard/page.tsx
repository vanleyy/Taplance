/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ProfileDetailsSchema,
  ProfileDetailsType,
} from "@/lib/validators/user-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
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
    const links = data?.links as Links;
    if (data) {
      form.setValue("fullname", data?.fullname);
      form.setValue("username", data?.username);
      form.setValue("avatar", data?.avatar);
      form.setValue("about", data.about ?? "");
      if (links) setNestedFormValues(form, "", links);
    }
  }, [data]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedAvatar(file);
    const previewUrl = URL.createObjectURL(file);
    form.setValue("avatar", previewUrl);
  }

  async function onSubmit(values: ProfileDetailsType) {
    let avatarUrl = data?.avatar;

    if (selectedAvatar) {
      const fileExt = selectedAvatar.name.split(".").pop();
      const fileName = `${data?.id}.${fileExt}`;
      const { data: uploadData, error } = await supabase.storage
        .from("public-avatars")
        .upload(fileName, selectedAvatar, { upsert: true });

      if (error) return toast.error("Failed to upload avatar");

      avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-avatars/${uploadData.path}`;
    }

    // sanitize null values
    const cleanedValues = nullToEmpty(values);
    function nullToEmpty(obj: any): any {
      if (obj === null) return "";
      if (Array.isArray(obj)) return obj.map(nullToEmpty);
      if (typeof obj === "object") {
        const res: any = {};
        for (const key in obj) {
          res[key] = nullToEmpty(obj[key]);
        }
        return res;
      }
      return obj;
    }

    try {
      await update({
        id: data?.id,
        fullname: cleanedValues.fullname,
        username: cleanedValues.username,
        about: cleanedValues.about,
        avatar: avatarUrl,
        links: {
          social: cleanedValues.social,
          professional: cleanedValues.professional,
          creative: cleanedValues.creative,
          messaging: cleanedValues.messaging,
          storefront: cleanedValues.storefront,
          miscellaneous: cleanedValues.miscellaneous,
        },
      });
    } catch {}
  }
  const onError = () => toast.error("Please fix the highlighted fields.");

  return (
    <div className="flex flex-col justify-center items-center gap-5 px-4 sm:px-6 lg:mx-28 mb-10">
      <div className="flex justify-center items-center w-full">
        {data?.links && (
          <div className="w-full rounded px-4 sm:px-5 outline py-2">
            <h4 className="font-bold">
              Congrats {data.username}! your page is ready!
            </h4>
            <Link className="underline text-xs" href="/hackedsdq">
              https://taplance.vercel.app/{data.username}
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
                    <Input placeholder="username" {...field} />
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
