"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { id: string; url: string }[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const fallback = "/images/placeholder-product.svg";
  const list =
    images.length > 0 ? images : [{ id: "fallback", url: fallback }];
  const active = list[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden ring-1 ring-brand-100/60 shadow-glow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
        />

        {/* Soft inner ring for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
      </div>

      {list.length > 1 && (
        <>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {list.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "shrink-0 h-16 w-16 rounded-xl overflow-hidden transition-all",
                  idx === activeIndex
                    ? "ring-2 ring-brand-600 ring-offset-2 ring-offset-[#f8faf9]"
                    : "ring-1 ring-gray-200 hover:ring-brand-300"
                )}
                aria-label={`View image ${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5 md:hidden">
            {list.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === activeIndex
                    ? "w-6 bg-brand-600"
                    : "w-1.5 bg-gray-300"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}