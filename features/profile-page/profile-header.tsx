"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

type ProfileHeaderProps = {
  data: {
    avatar: string;
    fullname: string;
    about: string | null;
  };
};

export default function ProfileHeader({ data }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full  items-center justify-center text-white text-4xl font-bold">
        <Avatar className="w-20 h-20">
          {data?.avatar && <AvatarImage src={data?.avatar} />}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <h1 className="flex flex-row items-center gap-2 mt-4 text-4xl font-bold">
        {data.fullname}
        <span className="ml-1 text-gray-400">
          <Image
            alt="check-svg"
            src="/check.svg"
            width={15}
            height={15}
            className="rounded-full"
          />
        </span>
      </h1>

      <p className="mt-2 text-center text-blue-400-600 w-[350px]">
        {data.about}
      </p>
    </div>
  );
}
