"use client";

import { useDateTime } from "@/hooks/useDateTime";

const Header = ({ text, user }: { text?: string; user?: User | null }) => {
  const { date, time } = useDateTime();

  return (
    <div className="flex items-end justify-between w-full border p-5 pt-7 rounded-xl sticky top-2 bg-linear-to-r from-[#008B93] to-[#025358] text-white z-50">
      <div className="flex flex-col items-baseline">
        <h1 className="font-bold text-xl lg:text-3xl leading-none">
          {text ?? `Welcome, ${user?.name}`}
        </h1>
        <span className="font-medium max-lg:text-xs text-white/70">{date}</span>
      </div>
      <div className="grid text-right">
        <span className="uppercase lg:text-xl font-semibold leading-none">
          {time}
        </span>
        <span className="font-medium text-white/70 text-xs lg:text-sm">
          Live Time (IST)
        </span>
      </div>
    </div>
  );
};

export default Header;
