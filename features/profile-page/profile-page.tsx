"use client";

import ProfileHeader from "@/features/profile-page/profile-header";
import LinkCard from "@/features/profile-page/profile-links";
import { getPublicUserProfile } from "@/lib/queries/users";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useMemo } from "react";
import { iconMap } from "@/lib/constants/icon-map";
import { flattenLinks } from "@/lib/helpers/flatten-links";
import { AlertCircle, Link as LinkIcon, Loader2 } from "lucide-react";

type Links = {
  social: { instagram: string; twitter: string };
  creative: { behance: string; dribbble: string };
  messaging: { whatsapp: string; telegram: string };
  storefront: { shopify: string; etsy: string };
  professional: { linkedin: string; portfolio: string };
  miscellaneous: { custom: string };
};

export default function ProfilePage({ user }: { user: string }) {
  const { data, error, isLoading } = useQuery(getPublicUserProfile(user));

  // Derive links from data instead of mirroring them into state, so removing
  // every link actually empties the list.
  const dynamicSocialLinks = useMemo(() => {
    const links = data?.links as Links | null | undefined;
    return links ? flattenLinks(links, iconMap) : [];
  }, [data]);

  // Loading state — isLoading is only true when there is no cached data yet,
  // unlike isValidating which is also true on every background revalidation.
  if (isLoading) {
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
      <div className="w-full sm:w-2/3 lg:w-1/2 xl:w-1/2 flex flex-col items-center">
        {/* Profile Header */}
        <ProfileHeader data={data} />

        {/* Links */}
        <div className="w-full mt-10 flex flex-col gap-3">
          {dynamicSocialLinks.length > 0 ? (
            dynamicSocialLinks.map((item) => (
              <LinkCard
                key={item.label}
                icon={item.icon}
                label={item.label}
                url={item.url}
              />
            ))
          ) : (
            <div className="w-full p-6 rounded-lg text-center text-gray-500 dark:text-gray-300 flex flex-col items-center gap-2">
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
