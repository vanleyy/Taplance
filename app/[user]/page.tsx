import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ProfilePage from "@/features/profile-page/profile-page";

type Props = {
  params: Promise<{ user: string }>;
};

// Per-profile SEO metadata so each /{username} URL gets its own title,
// description and share preview when linked on socials/messengers.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await params;
  const username = decodeURIComponent(user);

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("username, fullname, about, avatar")
    .eq("username", username)
    .maybeSingle();

  if (!data) {
    return {
      title: "Profile not found",
      description: "This Taplance profile does not exist.",
    };
  }

  const name = data.fullname || data.username || username;
  const title = `${name} | Taplance`;
  const description =
    (data.about?.trim() ?? "") || `Check out ${name}'s links on Taplance`;

  return {
    title,
    description,
    alternates: { canonical: `/${username}` },
    openGraph: {
      title,
      description,
      type: "website",
      ...(data.avatar ? { images: [{ url: data.avatar }] } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
      ...(data.avatar ? { images: [data.avatar] } : {}),
    },
  };
}

export default async function UserPage({ params }: Props) {
  const { user } = await params;
  // Route params arrive percent-encoded; the stored username is not.
  return <ProfilePage user={decodeURIComponent(user)} />;
}
