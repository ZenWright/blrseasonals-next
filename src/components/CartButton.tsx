"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="group relative z-50 inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-black hover:bg-black hover:text-white"
    >
      <span className="text-base">
        🛒
      </span>

      <span>
        Cart
      </span>

      {cartCount > 0 && (
        <span className="flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[10px] font-bold text-white transition group-hover:bg-white group-hover:text-black">
          {cartCount}
        </span>
      )}
    </Link>
  );
}