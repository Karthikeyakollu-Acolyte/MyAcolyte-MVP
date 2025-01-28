"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import acolyte from "../../public/acolytelogo.svg";

const Header = () => {
  const [lastChat, setLastChat] = useState("");

  useEffect(() => {
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const formattedTime = currentDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formattedDateTime = `${formattedDate} at ${formattedTime}`;

    setLastChat(formattedDateTime);
  }, []);

  return (
    <div className="flex w-full h-[89px] justify-between items-center px-5 bg-white shadow-sm">
      {/* Logo Section */}
      <div className="flex justify-center items-center">
        <Image
          loading="lazy"
          src={acolyte}
          alt="Application logo"
          className="object-contain shrink-0 aspect-[1.4] w-[90.52px] h-[65.33px]"
        />
      </div>

      {/* Center Section - Ask Acolyte and Last Chat */}
      <div className="flex flex-col justify-center items-center flex-grow mx-4 text-center">
        <div className="text-xl md:text-2xl font-semibold leading-none text-zinc-900">
          Ask Acolyte
        </div>
        <div className="flex gap-1 justify-center mt-2 text-sm md:text-base leading-none">
          <div className="text-left text-zinc-900">
            Last chat:{" "}
            <span className="text-[#999999] truncate">{lastChat}</span>
          </div>
        </div>
      </div>

      {/* Icons Section */}
      <div className="flex gap-4 md:gap-12 items-center">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/83deac17938cb4ccb69294ebc96715bf4e2313a3b60d35d1f2013d8f6df0eac4?placeholderIfAbsent=true&apiKey=785fca60b3d7474884994a6fbef7e047"
          alt="Navigation icon"
          className="object-contain w-6 md:w-[59px] aspect-[1.64]"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/65fea65d2aa0cffd65e8e1e8d3e6fe4e0cc6d9182a9233ae08261ad6c6cd3be7?placeholderIfAbsent=true&apiKey=785fca60b3d7474884994a6fbef7e047"
          alt="Settings"
          className="object-contain w-5 md:w-8 aspect-square"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f165685976ab11d8170e2128281b5a1d14c282b1096434c2f1077c8c5782d02d?placeholderIfAbsent=true&apiKey=785fca60b3d7474884994a6fbef7e047"
          alt="Notifications"
          className="object-contain w-5 md:w-[31px] aspect-square rounded-full"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d430e16a8e70b086f0a607c369f3d0ac3b71d7dbecf1563ea31cdb8b62520d0?placeholderIfAbsent=true&apiKey=785fca60b3d7474884994a6fbef7e047"
          alt="User profile"
          className="object-contain w-5 md:w-[31px] aspect-[0.97]"
        />
      </div>
    </div>
  );
};

export default Header;
