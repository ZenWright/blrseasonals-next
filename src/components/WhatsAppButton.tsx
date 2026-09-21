"use client";

type WhatsAppButtonProps = {
  product?: {
    id: string | number;
    name: string;
    price: number;
  };
};

export default function WhatsAppButton({
  product,
}: WhatsAppButtonProps) {
  const phoneNumber = "919319780827";

  const handleWhatsApp = () => {
    let message = "Hi, I'm interested in a product from BLR Seasonals.";

    if (product) {
      message =
        `Hi, I'm interested in this product from BLR Seasonals.\n\n` +
        `Product: ${product.name}\n` +
        `Product ID: ${product.id}\n` +
        `Price: ₹${product.price.toLocaleString("en-IN")}\n\n` +
        `Product link: ${window.location.href}`;
    }

    const whatsappUrl =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleWhatsApp}
      aria-label="Chat with BLR Seasonals on WhatsApp"
      className="fixed bottom-6 right-6 z-60 flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-green-600"
    >
      <span className="text-xl">💬</span>
      <span>WhatsApp</span>
    </button>
  );
}