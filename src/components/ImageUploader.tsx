"use client";

import { useState } from "react";
import { X, Upload, ImageIcon, AlertCircle } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUploader({ value, onChange, max = 5 }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  const canUploadMore = value.length < max;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-gray-900">Photos</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Up to {max} images, max 4MB each. First image is the cover.
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {value.length} / {max}
        </span>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-brand-600 text-white text-[10px] font-semibold uppercase">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-4 w-4 text-gray-700" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {canUploadMore ? (
        <UploadDropzone
          endpoint="productImage"
          onClientUploadComplete={(res) => {
            const urls = res.map((r) => r.url);
            onChange([...value, ...urls].slice(0, max));
            setError(null);
          }}
          onUploadError={(err) => {
            console.error(err);
            setError(err.message || "Upload failed");
          }}
          config={{ mode: "auto" }}
          appearance={{
            container:
              "border border-dashed border-gray-300 rounded-xl p-4 mt-0 cursor-pointer hover:border-brand-400 transition-colors",
            uploadIcon: "text-brand-600",
            label: "text-sm font-medium text-gray-800",
            allowedContent: "text-xs text-gray-500",
            button:
              "bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 mt-2 after:bg-brand-600",
          }}
          content={{
            label: "Choose images or drag and drop",
            allowedContent: "PNG, JPG, WEBP up to 4MB",
            button({ isUploading }) {
              return isUploading ? "Uploading..." : "Select files";
            },
          }}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500">
            Maximum of {max} images reached. Remove one to upload another.
          </p>
        </div>
      )}

      {value.length === 0 && !canUploadMore && (
        <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-center">
          <ImageIcon
            className="h-6 w-6 mx-auto text-gray-400"
            strokeWidth={2}
          />
          <p className="text-xs text-gray-500 mt-2">No photos added yet</p>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
          <AlertCircle
            className="h-4 w-4 text-red-600 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}