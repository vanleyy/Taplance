"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sanitizeUsername } from "./inputs/handle-input";

/**
 * Avatar + username/fullname/about fields for the dashboard form. Renders
 * through the nearest <Form>, so it's dropped straight into the page.
 */
export function BasicFields({
  onAvatarChange,
}: {
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const form = useFormContext();
  const avatar = form.watch("avatar");

  return (
    <>
      <div className="flex flex-col justify-center items-center text-center">
        <label htmlFor="avatarUpload" className="cursor-pointer">
          <Avatar className="w-20 h-20 hover:opacity-80 transition">
            {avatar && <AvatarImage src={avatar} />}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </label>

        <input
          id="avatarUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
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
    </>
  );
}
