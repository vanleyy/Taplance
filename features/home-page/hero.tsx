import { ArrowRight, CornerRightDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-28 pt-20 pb-24">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Badge */}

        <Link
          href="https://github.com/vanleyy/Taplance"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="flex items-center gap-2 border rounded-full px-4 py-1 text-xs transition hover:bg-muted">
            <Sparkles size={14} />
            <span className="group-hover:underline underline-offset-4">
              Contribute to this project on GitHub
            </span>
            <ArrowRight size={14} />
          </div>
        </Link>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Share your every social in
          </h1>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            one single accessible link.
          </h1>
        </div>

        {/* Description */}
        <p className="max-w-sm sm:max-w-xl lg:max-w-2xl text-sm sm:text-base lg:text-lg text-foreground/70">
          Effortlessly simplify and amplify your digital presence with Taplance
          — the smart link that brings all your content, profiles, and
          opportunities together in one beautiful, shareable place.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          <Link href="/login">
            <Button className="w-full sm:w-auto">
              Get Started
              <CornerRightDown size={12} />
            </Button>
          </Link>

          <Button variant="outline" className="w-full sm:w-auto">
            <Link href="/hackedsdq">Preview</Link>
            <ArrowRight className="-rotate-45" size={12} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
