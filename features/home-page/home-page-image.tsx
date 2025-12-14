import Image from "next/image";
import React from "react";

const HomePageImage = () => {
  return (
    <div className="relative w-2/4 aspect-video">
      <Image
        className="rounded-xl"
        layout="fill"
        src={"/home_page.png"}
        alt="homepage"
      />
    </div>
  );
};

export default HomePageImage;
