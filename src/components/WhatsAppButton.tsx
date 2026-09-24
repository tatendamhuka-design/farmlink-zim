import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  href: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  label?: string;
}

/**
 * Uses Lucide's MessageCircle as a stand-in for the WhatsApp icon.
 * If we license the official WhatsApp icon later, swap the icon only.
 */
export function WhatsAppButton({
  href,
  size = "md",
  fullWidth,
  className,
  label = "WhatsApp",
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex", fullWidth && "w-full", className)}
    >
      <Button
        variant="primary"
        size={size}
        fullWidth={fullWidth}
        className="bg-[#25D366] hover:bg-[#1ebe5a] active:bg-[#19a54d]"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
        {label}
      </Button>
    </a>
  );
}