"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({
  product,
}: ProductActionsProps) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isInStock = product.inventory > 0;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(product.inventory, current + 1)
    );
  };

  const handleAddToCart = () => {
    if (!isInStock) return;

    addToCart(product, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  if (!isInStock) {
    return (
      <button
        type="button"
        disabled
        className="mt-7 w-full rounded-xl bg-gray-300 px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div>
      {/* Quantity */}
      <div className="mt-7">
        <p className="mb-3 text-sm font-semibold">
          Quantity
        </p>

        <div className="flex h-12 w-36 items-center rounded-xl border border-black/15 bg-white">

          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="flex h-full w-12 items-center justify-center text-lg text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <div className="flex flex-1 items-center justify-center text-sm font-semibold">
            {quantity}
          </div>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= product.inventory}
            className="flex h-full w-12 items-center justify-center text-lg text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Increase quantity"
          >
            +
          </button>

        </div>

        <p className="mt-2 text-xs text-gray-500">
          Maximum available: {product.inventory}
        </p>
      </div>

      {/* Add To Cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`mt-7 w-full rounded-xl px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition ${
          added
            ? "bg-green-700"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {added ? "✓ Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}