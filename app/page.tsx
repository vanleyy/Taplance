import type { Metadata } from "next";
import Footer from "@/features/home-page/footer";
import Hero from "@/features/home-page/hero";
import HomePageImage from "@/features/home-page/home-page-image";
import NavBar from "@/components/navbar";

export const metadata: Metadata = {
  title: { absolute: "Taplance — Your profile & links platform" },
  description:
    "Create a single link-in-bio page that brings all your socials, storefront and messaging apps together.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen  justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full flex flex-col items-center gap-20 mb-4">
        <NavBar userAuthenticated={false} />
        <Hero />
        <HomePageImage />
        <Footer />
      </main>
    </div>
  );
}
