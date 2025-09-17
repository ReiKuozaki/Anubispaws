"use client";
import React from "react";
import Image from "next/image";
import { cn } from "../../../lib/utils";

// ContentCard Component
const ContentCard = ({ title, category, logo }: { title?: string; category?: string; logo?: string }) => {
  return (
    <div className="relative flex h-full flex-col items-start justify-between p-6" style={{ backgroundColor: "rgba(0,0,0)" }}>
      <div className="relative z-10">
        {category && <div className="text-xs text-gray-200">{category}</div>}
        {title && <div className="mr-2 text-lg font-bold leading-tight tracking-wide text-red-300">{title}</div>}
      </div>
      {logo && <Image src={logo} alt={title || ""} width={36} height={36} className="z-10 rounded-lg" />}
    </div>
  );
};

// SimpleImageCard component
const SimpleImageCard = ({ image }: { image: string }) => {
  return (
    <div className="h-60 w-48 rounded-lg overflow-hidden shadow-md relative">
      <Image src={image} alt="case study" fill className="object-cover" />
    </div>
  );
};

// HoverRevealSlip wrapper
const HoverRevealSlip = ({ show }: { show: React.ReactNode }) => {
  const common = "absolute flex w-full h-full [backface-visibility:hidden]";
  return (
    <div className={cn("group relative h-60 w-52 [perspective:1000px]")}>
      <div className={cn("absolute inset-0 h-full w-48 rounded-lg bg-gray-50 shadow-md")} />
      <div className={cn("relative z-50 h-full w-48 origin-left transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-30deg)]")}>
        <div className={cn("h-full w-full rounded-lg bg-white shadow-md", common)}>{show}</div>
      </div>
      <div className={cn("z-1 absolute bottom-0 right-0 flex h-48 w-14 -translate-x-10 transform items-start justify-start rounded-r-lg bg-green-600 pl-2 pt-2 text-xs font-bold text-white transition-transform duration-300 ease-in-out [backface-visibility:hidden] group-hover:translate-x-0 group-hover:rotate-[5deg]")}>
        <div className="-rotate-90 whitespace-nowrap pb-20 pr-9 pt-1">CLICK TO PROCEED</div>
      </div>
    </div>
  );
};

// Main CaseStudyCard props
interface CaseStudyCardProps {
  title?: string;
  category?: string;
  link: string;
  image?: string;
  logo?: string;
  type: "content" | "simple-image";
}

// Main CaseStudyCard Component
export default function CaseStudyCard({ title, category, link, image, logo, type }: CaseStudyCardProps) {
  return (
    <div className="flex gap-8">
      <a href={link} className="block">
        <HoverRevealSlip
          show={type === "content" ? <ContentCard title={title} category={category} logo={logo} /> : <SimpleImageCard image={image!} />}
        />
      </a>
    </div>
  );
}
