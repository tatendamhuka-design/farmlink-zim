/**
 * Build a WhatsApp deep link with a pre-filled message.
 * Uses wa.me which works on web, iOS, and Android.
 */
export function buildWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const clean = phoneNumber.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
}

export function buildProductEnquiryMessage(params: {
  farmerName: string;
  productTitle: string;
  quantity: number;
  unit: string;
}): string {
  return `Hi ${params.farmerName}, I found your ${params.quantity} ${params.unit} of ${params.productTitle} on FarmLink Zim. Are they still available?`;
}

export function buildSourcingResponseMessage(params: {
  customerName: string;
  requestTitle: string;
}): string {
  return `Hi ${params.customerName}, I saw your request "${params.requestTitle}" on FarmLink Zim. I can supply it.`;
}