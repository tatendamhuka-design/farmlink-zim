import { Spinner } from "@/components/Spinner";

interface BrandLoaderProps {
  label?: string;
}

export function BrandLoader({ label = "Loading..." }: BrandLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        {/* Pulsing ring behind the spinner */}
        <span className="absolute inset-0 rounded-full bg-brand-400/20 animate-ping" />
        <div className="relative h-12 w-12 rounded-full bg-white ring-1 ring-brand-100 flex items-center justify-center shadow-soft">
          <Spinner size="md" />
        </div>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}