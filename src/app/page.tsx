"use client";

import ProductCard from "@/components/ProductCard";
import CartButton from "@/components/CartButton";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  inventory: number;
  images: string[];
  seasonal_collections: string[];
  category: string;
  featured: boolean;
};

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const [error, setError] = useState("");

  // =========================================================
  // Load Featured Products From FastAPI / MySQL
  // =========================================================

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const data: Product[] = await response.json();

        const featuredProducts = data
          .filter((product) => product.featured)
          .slice(0, 4);

        setProducts(featuredProducts);
      } catch (error) {
        console.error(
          "Failed to load homepage products:",
          error
        );

        setError(
          "Unable to load products right now."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // =========================================================
  // Load Categories From FastAPI / MySQL
  // =========================================================

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load categories."
          );
        }

        const data: Category[] =
          await response.json();

        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to load homepage categories:",
          error
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-[#fdf8f3]">

      {/* =====================================================
          Header
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#fdf8f3]/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Brand */}

          <Link
            href="/"
            className="group"
          >
            <h1 className="font-serif text-2xl font-bold text-stone-900 transition group-hover:opacity-70">
              BLR Seasonals
            </h1>

            <p className="text-xs uppercase tracking-widest text-stone-500">
              Handcrafted · Est. 2024
            </p>
          </Link>


          {/* =================================================
              Navigation
          ================================================= */}

          <nav className="hidden items-center gap-8 md:flex">

            <Link
              href="/"
              className="text-sm font-medium text-stone-900 transition hover:text-stone-500"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-stone-700 transition hover:text-stone-900"
            >
              About
            </Link>
            
                <Link
      href="/cart"
      className="text-sm font-medium text-stone-700 transition hover:text-stone-900"
    >
      Cart
    </Link>


            {/* =================================================
                Shop Menu
            ================================================= */}

            <div className="group relative">

              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-stone-700 transition hover:text-stone-900"
              >
                Shop

                <span className="text-xs">
                  ▾
                </span>
              </Link>


              {/* Dropdown */}

              <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">

                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">

                  <Link
                    href="/products"
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
                  >
                    Shop All Products
                  </Link>


                  <div className="my-1 border-t border-stone-100" />


                  {categoriesLoading ? (

                    <div className="px-4 py-3 text-sm text-stone-500">
                      Loading categories...
                    </div>

                  ) : categories.length > 0 ? (

                    categories.map((category) => (

                      <Link
                        key={category.id}
                        href={`/products?category=${encodeURIComponent(
                          category.name
                        )}`}
                        className="block rounded-xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
                      >
                        {category.name}
                      </Link>

                    ))

                  ) : (

                    <div className="px-4 py-3 text-sm text-stone-500">
                      Categories unavailable
                    </div>

                  )}

                </div>

              </div>

            </div>

            <Link
              href="/contact"
              className="text-sm font-medium text-stone-700 transition hover:text-stone-900"
            >
              Contact
            </Link>

          </nav>


          {/* Desktop Cart */}

<div className="hidden md:block">
  <CartButton />
</div>

{/* Mobile Menu Button */}

<button
  type="button"
  onClick={() => setIsMobileMenuOpen((open) => !open)}
  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={isMobileMenuOpen}
  className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xl text-stone-800 shadow-sm md:hidden"
>
  {isMobileMenuOpen ? "✕" : "☰"}
</button>

</div>

{/* =====================================================
    Mobile Navigation
===================================================== */}

{isMobileMenuOpen && (
  <div className="border-t border-stone-200 bg-white px-6 py-4 shadow-lg md:hidden">
    <nav className="mx-auto max-w-7xl">

      <Link
        href="/"
        onClick={() => setIsMobileMenuOpen(false)}
        className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
      >
        Home
      </Link>

      <Link
        href="/products"
        onClick={() => setIsMobileMenuOpen(false)}
        className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
      >
        Shop All Products
      </Link>

      <Link
        href="/about"
        onClick={() => setIsMobileMenuOpen(false)}
        className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
      >
        About
      </Link>

      <div className="my-2 border-t border-stone-100" />

      <p className="px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-widest text-stone-400">
        Categories
      </p>

      {categoriesLoading ? (
        <div className="px-4 py-3 text-sm text-stone-500">
          Loading categories...
        </div>
      ) : categories.length > 0 ? (
        categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
          >
            {category.name}
          </Link>
        ))
      ) : (
        <div className="px-4 py-3 text-sm text-stone-500">
          Categories unavailable
        </div>
      )}

      <div className="my-2 border-t border-stone-100" />

      <Link
        href="/seasonal-collections"
        onClick={() => setIsMobileMenuOpen(false)}
        className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
      >
        Seasonal Collections
      </Link>

      <Link
        href="/contact"
        onClick={() => setIsMobileMenuOpen(false)}
        className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
      >
        Contact
      </Link>

      <Link
        href="/cart"
        onClick={() => setIsMobileMenuOpen(false)}
        className="mt-2 flex items-center justify-between rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
      >
        <span>Cart</span>
        <span className="text-lg">🛒</span>
      </Link>

    </nav>
  </div>
)}

</header>


      {/* =====================================================
          Hero
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">

        <div className="max-w-4xl">

          <span className="inline-block rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
            Festive Sale · Up to 40% off
          </span>


          <h2 className="mt-6 font-serif text-5xl font-semibold leading-tight text-stone-900 md:text-6xl">
            Timeless Pieces
            <br />
            for Every Home
          </h2>


          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
            Discover handcrafted décor, antique collectibles,
            elegant showpieces, vintage-inspired pieces and
            seasonal gifting collections.
          </p>


          {/* Hero CTA */}

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/products"
              className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Explore Collection
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-800 transition hover:border-black"
            >
              Shop All Products
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          Best Sellers
      ===================================================== */}

      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-10">

            <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">
              Loved by many
            </p>

            <h2 className="mt-2 font-serif text-4xl font-semibold text-stone-900">
              Best Sellers
            </h2>

            <p className="mt-2 text-stone-600">
              Our most-adored handcrafted pieces.
            </p>

          </div>


          {/* =================================================
              Loading
          ================================================= */}

          {isLoading && (

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (

                <div
                  key={item}
                  className="h-[430px] animate-pulse rounded-2xl bg-stone-100"
                />

              ))}

            </div>

          )}


          {/* =================================================
              Error
          ================================================= */}

          {!isLoading && error && (

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-4 rounded-full bg-black px-6 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>

            </div>

          )}


          {/* =================================================
              Products
          ================================================= */}

          {!isLoading &&
            !error &&
            products.length > 0 && (

              <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">

                {products.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                ))}

              </div>

            )}


          {/* =================================================
              No Featured Products
          ================================================= */}

          {!isLoading &&
            !error &&
            products.length === 0 && (

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-10 text-center">

                <p className="text-sm text-stone-600">
                  Featured products will appear here soon.
                </p>

              </div>

            )}


          {/* =================================================
              View All
          ================================================= */}

          {!isLoading &&
            !error &&
            products.length > 0 && (

              <div className="mt-10 text-center">

                <Link
                  href="/products"
                  className="inline-flex rounded-full border border-black px-7 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  View All Products
                </Link>

              </div>

            )}

        </div>

      </section>


      {/* =====================================================
          Brand Statement
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="rounded-3xl bg-stone-900 px-8 py-14 text-center text-white md:px-16">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">
            BLR Seasonals
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl font-semibold md:text-4xl">
            Heritage character. Distinctive craftsmanship.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-stone-300">
            From handcrafted wooden pieces to antique-inspired
            décor, collectibles and seasonal finds, we curate
            distinctive products for homes, offices and gifting.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-200"
          >
            Discover BLR Seasonals
          </Link>

        </div>

      </section>


      {/* =====================================================
          Footer
      ===================================================== */}

      <footer className="border-t border-stone-200 bg-[#fdf8f3]">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <div className="text-center md:text-left">

              <p className="font-serif text-lg font-semibold text-stone-900">
                BLR Seasonals
              </p>

              <p className="mt-1 text-xs text-stone-500">
                Distinctive pieces for every season.
              </p>

            </div>


            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-stone-500">
              <Link href="/about" className="transition hover:text-black">
                About
              </Link>

              <Link href="/contact" className="transition hover:text-black">
                Contact
              </Link>

              <Link href="/faq" className="transition hover:text-black">
                FAQ
              </Link>

              <Link
                href="/shipping-returns"
                className="transition hover:text-black"
              >
                Shipping & Returns
              </Link>

              <Link
                href="/privacy-policy"
                className="transition hover:text-black"
              >
                Privacy Policy
              </Link>

              <Link href="/terms" className="transition hover:text-black">
                Terms & Conditions
              </Link>
            </div>

            <p className="text-sm text-stone-500">
              © {new Date().getFullYear()} BLR Seasonals. All rights reserved.
            </p>

          </div>

        </div>

            </footer>

      {/* Floating Cart Button */}
      <Link
        href="/cart"
        aria-label="Open shopping cart"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg transition hover:scale-105 hover:bg-stone-800"
      >
        🛒
      </Link>

    </main>
  );
}