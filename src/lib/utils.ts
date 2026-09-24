export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number, currency = "USD"): string {
  return `$${amount.toFixed(2)}`;
}

export function formatQuantity(quantity: number, unit: string): string {
  if (quantity >= 1000) {
    const tonnes = quantity / 1000;
    return `${tonnes % 1 === 0 ? tonnes : tonnes.toFixed(1)} tonnes`;
  }
  return `${quantity} ${unit}`;
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
}