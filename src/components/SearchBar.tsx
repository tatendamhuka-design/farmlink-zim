"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search for products, e.g. onions, maize...",
  className,
  autoFocus,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          strokeWidth={2}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>
    </form>
  );
}