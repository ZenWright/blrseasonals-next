import Link from "next/link";
import CartButton from "@/components/CartButton";
import ProductFilters from "@/components/ProductFilters";
import type { Product } from "@/types/product";

async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products from FastAPI");
  }

  return response.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900">

      {/* =====================================================
          Header
      ===================================================== */}

      <header className="border-b border-black/10 bg-[#faf7f2]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          <Link
            href="/"
            className="group"
          >
            <div className="font-serif text-2xl font-bold tracking-tight">
              BLR Seasonals
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Handcrafted · Est. 2024
            </div>
          </Link>


          <div className="flex items-center gap-4">

            <Link
              href="/"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              ← Back to Home
            </Link>

            <CartButton />

          </div>

        </div>

      </header>


      {/* =====================================================
          Page Introduction
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-14 md:pb-14 md:pt-20">

        <div className="max-w-3xl">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            BLR Seasonals Collection
          </p>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-6xl">
            Our Products
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Discover distinctive décor pieces selected to bring character,
            warmth and timeless style to your home, office and personal spaces.
          </p>

        </div>

      </section>


      {/* =====================================================
          Products + Filters
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-20">

        <ProductFilters
          products={products}
        />

      </section>


      {/* =====================================================
          Bottom Information
      ===================================================== */}

      <section className="border-t border-black/10 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="grid gap-8 md:grid-cols-3">

            <div>

              <p className="text-lg">
                ✦
              </p>

              <h2 className="mt-3 font-serif text-xl font-bold">
                Handcrafted Character
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Carefully selected pieces designed to add personality and
                character to your space.
              </p>

            </div>


            <div>

              <p className="text-lg">
                ◇
              </p>

              <h2 className="mt-3 font-serif text-xl font-bold">
                Quality Collection
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Explore distinctive décor pieces with a focus on style,
                craftsmanship and lasting appeal.
              </p>

            </div>


            <div>

              <p className="text-lg">
                ⌂
              </p>

              <h2 className="mt-3 font-serif text-xl font-bold">
                Made for Your Space
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Find pieces for your home, office and other spaces that deserve
                something special.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          Footer
      ===================================================== */}

      <footer className="border-t border-black/10 bg-[#faf7f2]">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} BLR Seasonals. All rights reserved.
          </p>

          <Link
            href="/"
            className="transition hover:text-black"
          >
            BLR Seasonals
          </Link>

        </div>

      </footer>

    </main>
  );
}