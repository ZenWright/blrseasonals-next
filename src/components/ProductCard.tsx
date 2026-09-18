"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discount =
    product.mrp > 0
      ? Math.round(
          ((product.mrp - product.price) /
            product.mrp) *
            100
        )
      : 0;

  const hasSeasonalCollection =
    product.seasonal_collections &&
    product.seasonal_collections.length > 0;

  const handleAddToCart = () => {
    if (product.inventory <= 0) {
      return;
    }

    addToCart(product);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* =====================================================
          Product Image
      ===================================================== */}

      <Link href={`/products/${product.id}`}>

        <div className="relative aspect-square overflow-hidden bg-stone-100">

          {!imageError && product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              onError={() => setImageError(true)}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-100 px-6 text-center">
              <span className="text-sm text-stone-400">
                Image unavailable
              </span>
            </div>
          )}


          {/* Featured */}

          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}


          {/* Discount */}

          {discount > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
              {discount}% OFF
            </span>
          )}


          {/* Seasonal Collection */}

          {hasSeasonalCollection && (
            <span className="absolute bottom-3 right-3 max-w-[70%] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm">
              {product.seasonal_collections[0]}
            </span>
          )}


          {/* Out of Stock */}

          {product.inventory <= 0 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}

        </div>

      </Link>


      {/* =====================================================
          Product Details
      ===================================================== */}

      <div className="p-4">

        {/* Category */}

        <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">
          {product.category}
        </p>


        {/* Product Name */}

        <Link href={`/products/${product.id}`}>

          <h3 className="min-h-[48px] text-sm font-semibold leading-6 text-stone-900 transition hover:text-stone-600">
            {product.name}
          </h3>

        </Link>


        {/* Price */}

        <div className="mt-2 flex items-center gap-2">

          <span className="font-semibold text-stone-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.mrp > product.price && (
            <span className="text-sm text-stone-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}

        </div>


        {/* Stock Information */}

        {product.inventory > 0 &&
          product.inventory <= 3 && (
            <p className="mt-2 text-xs font-medium text-amber-700">
              Only {product.inventory} left in stock
            </p>
          )}


        {/* =================================================
            Add To Cart
        ================================================= */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.inventory <= 0}
          className={`mt-4 w-full rounded-full border py-2.5 text-sm font-medium transition ${
            product.inventory <= 0
              ? "cursor-not-allowed border-stone-300 bg-stone-100 text-stone-400"
              : added
              ? "border-green-700 bg-green-700 text-white"
              : "border-stone-400 hover:bg-stone-900 hover:text-white"
          }`}
        >
          {product.inventory <= 0
            ? "Out of Stock"
            : added
            ? "✓ Added to Cart"
            : "Add to Cart"}
        </button>

      </div>

    </div>
  );
}