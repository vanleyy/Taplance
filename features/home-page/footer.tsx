import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full px-4 sm:px-6 lg:px-28 py-6">
      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-1">
        <span>Built by</span>

        <Link
          href="https://github.com/hackedsdq"
          className="underline hover:text-foreground transition"
          target="_blank"
        >
          hackedsdq
        </Link>

        <span className="hidden sm:inline">·</span>

        <span>Source code on</span>

        <Link
          href="https://github.com/vanleyy/Taplance"
          className="underline hover:text-foreground transition"
          target="_blank"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
