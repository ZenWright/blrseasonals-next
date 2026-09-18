"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    notices,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
  } = useCart();

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900">

      {/* Header */}
      <header className="border-b border-black/10 bg-[#faf7f2]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

          <Link href="/" className="group">
            <div className="font-serif text-2xl font-bold tracking-tight">
              BLR Seasonals
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Handcrafted · Est. 2024
            </div>
          </Link>

          <Link
            href="/products"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            ← Continue Shopping
          </Link>

        </div>
      </header>

      {/* Page Heading */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 md:pt-16">

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          Your Selection
        </p>

        <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">
          Shopping Cart
        </h1>

      </section>

      {/* Cart */}
      <section className="mx-auto max-w-6xl px-6 pb-20">

        {cartItems.length === 0 ? (

          /* Empty Cart */
          <div className="rounded-3xl border border-black/10 bg-white px-6 py-20 text-center">

            <div className="text-5xl">
              🛒
            </div>

            <h2 className="mt-6 font-serif text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
              You haven't added anything to your cart yet.
              Explore our collection and find something special.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Browse Products
            </Link>

          </div>

        ) : (

          <>
            {/* Stock Notices */}
            {notices.length > 0 && (
              <div className="mb-6 space-y-3">
                {notices.map((notice) => (
                  <div
                    key={`${notice.productId}-${notice.type}`}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                  >
                    <span className="font-semibold">⚠️</span>{" "}
                    {notice.message}
                  </div>
                ))}
              </div>
            )}

            {/* Cart With Products */}
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

              {/* Cart Items */}
              <div className="space-y-4">

                {cartItems.map((item) => {

                  const product = item.product;
                  const itemTotal = product.price * item.quantity;
                  const isOutOfStock = product.inventory <= 0;

                  return (
                    <div
                      key={product.id}
                      className="rounded-2xl border border-black/10 bg-white p-5"
                    >

                      <div className="flex flex-col gap-5 sm:flex-row">

                        {/* Product Image */}
                        <Link
                          href={`/products/${product.id}`}
                          className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-100 sm:h-36 sm:w-36"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-contain p-3"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col">

                          <div className="flex flex-col justify-between gap-3 sm:flex-row">

                            <div>
                              <p className="text-xs uppercase tracking-wider text-gray-500">
                                {product.category}
                              </p>

                              <Link
                                href={`/products/${product.id}`}
                                className="mt-1 block font-serif text-xl font-bold transition hover:text-gray-600"
                              >
                                {product.name}
                              </Link>

                              <p className="mt-2 font-semibold">
                                {formatPrice(product.price)}
                              </p>
                            </div>

                            <p className="text-lg font-bold">
                              {formatPrice(itemTotal)}
                            </p>

                          </div>

                          {/* Out of Stock Warning */}
                          {isOutOfStock && (
                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                              ⚠️ This product is currently out of stock.
                              Please remove it before checkout.
                            </div>
                          )}

                          {/* Quantity + Remove */}
                          <div className="mt-5 flex flex-wrap items-center gap-4">

                            <div className="flex h-10 items-center rounded-lg border border-black/15 bg-white">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  isOutOfStock
                                }
                                className="flex h-full w-10 items-center justify-center text-lg text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label={`Decrease ${product.name} quantity`}
                              >
                                −
                              </button>

                              <div className="flex w-10 items-center justify-center text-sm font-semibold">
                                {item.quantity}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  isOutOfStock ||
                                  item.quantity >= product.inventory
                                }
                                className="flex h-full w-10 items-center justify-center text-lg text-gray-600 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label={`Increase ${product.name} quantity`}
                              >
                                +
                              </button>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(product.id)
                              }
                              className="text-sm font-medium text-red-600 underline underline-offset-4 transition hover:text-red-800"
                            >
                              Remove
                            </button>

                            <span
                              className={`text-xs ${
                                isOutOfStock
                                  ? "font-semibold text-red-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {isOutOfStock
                                ? "Out of stock"
                                : `${product.inventory} available`}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

                {/* Clear Cart */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-black"
                  >
                    Clear Cart
                  </button>
                </div>

              </div>

              {/* Order Summary */}
              <aside className="h-fit rounded-2xl border border-black/10 bg-white p-6 lg:sticky lg:top-6">

                <h2 className="font-serif text-2xl font-bold">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4 border-b border-black/10 pb-6">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Shipping
                    </span>

                    <span className="font-medium text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>

                </div>

                <div className="mt-6 flex items-center justify-between">

                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    {formatPrice(cartSubtotal)}
                  </span>

                </div>

                {/* Checkout */}
                {notices.some(
                  (notice) => notice.type === "out_of_stock"
                ) ? (
                  <div className="mt-7 rounded-xl bg-gray-100 px-6 py-4 text-center text-sm font-semibold text-gray-500">
                    Remove unavailable products to continue
                  </div>
                ) : (
                  <Link
                    href="/checkout"
                    className="mt-7 block w-full rounded-xl bg-black px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-gray-800"
                  >
                    Proceed to Checkout
                  </Link>
                )}

                <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                  Secure checkout with live inventory verification.
                </p>

              </aside>

            </div>
          </>

        )}

      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} BLR Seasonals. All rights reserved.
          </p>

          <Link
            href="/products"
            className="transition hover:text-black"
          >
            Continue Shopping
          </Link>

        </div>
      </footer>

    </main>
  );
}