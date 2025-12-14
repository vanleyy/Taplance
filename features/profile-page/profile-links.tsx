import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  url: string;
}

export default function LinkButton({ icon, label, url }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex justify-center group"
    >
      <Button
        variant="outline"
        className="
      w-full
      h-13 
      text-base 
      rounded-lg 
      relative 
      justify-center
      group-hover:w-11/12
      hover:bg-primary 
      hover:text-secondary
      cursor-pointer
    "
      >
        <span className="mr-3 absolute left-4">{icon}</span>
        {label}
      </Button>
    </a>
  );
}
