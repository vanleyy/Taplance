"use client";

import ProfileHeader from "@/features/profile-page/profile-header";
import LinkButton from "@/features/profile-page/profile-links";
import { getPublicUserProfile } from "@/lib/queries/users";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useEffect, useState } from "react";
import { iconMap } from "@/lib/constants/icon-map";
import { flattenLinks } from "@/lib/helpers/flatten-links";
import { AlertCircle, Link as LinkIcon, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { JSX } from "react";

type Links = {
  social: { instagram: string; twitter: string };
  creative: { behance: string; dribbble: string };
  messaging: { whatsapp: string; telegram: string };
  storefront: { shopify: string; etsy: string };
  professional: { linkedin: string; portfolio: string };
  miscellaneous: { custom: string };
};

export default function ProfilePage() {
  const { user } = useParams() as { user: string };
  const [dynamicSocialLinks, setDynamicSocialLinks] = useState<
    { label: string; icon: JSX.Element; url: string }[]
  >([]);

  const { data, error, isValidating } = useQuery(getPublicUserProfile(user));

  useEffect(() => {
    if (data) {
      const links = data.links as Links;
      if (links) {
        const flattened = flattenLinks(links, iconMap);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDynamicSocialLinks(flattened);
      }
    }
  }, [data]);

  // Loading state
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen relative top-1/3">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  // User not found / error
  if (!data || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The username {user} does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-start sm:items-center px-4 sm:px-6 lg:px-28 pt-10 sm:pt-20 pb-10">
      <div className="w-full sm:w-4/5 lg:w-2/3 xl:w-1/2 flex flex-col items-center">
        {/* Profile Header */}
        <ProfileHeader data={data} />

        {/* Links */}
        <div className="w-full mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dynamicSocialLinks.length > 0 ? (
            dynamicSocialLinks.map((item) => (
              <LinkButton
                key={item.label}
                icon={item.icon}
                label={item.label}
                url={item.url}
              />
            ))
          ) : (
            <div className="w-full p-6 rounded-lg text-center text-gray-500 dark:text-gray-300 flex flex-col items-center gap-2 col-span-full">
              <LinkIcon
                size={26}
                className="text-gray-400 dark:text-gray-400"
              />
              <p className="text-lg font-semibold">No Links Available</p>
              <p className="text-sm">
                Once you add social or professional links, they will appear
                here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
