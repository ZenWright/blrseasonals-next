import Link from "next/link";

import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import type { Product } from "@/types/product";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/products`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const products: Product[] = await response.json();

    return products.find((product) => product.id === id) ?? null;
  } catch (error) {
    console.error("Failed to load product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-6 py-20 text-gray-900">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            BLR Seasonals
          </p>

          <h1 className="mt-5 font-serif text-4xl font-bold">
            Product Not Found
          </h1>

          <p className="mt-4 text-gray-600">
            The product you are looking for could not be found.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const discount =
    product.mrp > product.price
      ? Math.round(
          ((product.mrp - product.price) / product.mrp) * 100
        )
      : 0;

  const isInStock = product.inventory > 0;

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
            ← Back to Shop
          </Link>

        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="text-sm text-gray-500">

          <Link href="/" className="hover:text-black">
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link href="/products" className="hover:text-black">
            Products
          </Link>

          <span className="mx-2">/</span>

          <span>{product.category}</span>

          <span className="mx-2">/</span>

          <span className="text-gray-900">
            {product.name}
          </span>

        </div>
      </div>

      {/* Product Section */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-16">

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">

          {/* Product Gallery */}
          <div className="relative">

            {discount > 0 && (
              <div className="absolute right-5 top-5 z-20 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white">
                {discount}% OFF
              </div>
            )}

            {product.featured && (
              <div className="absolute left-5 top-5 z-20 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white">
                Featured
              </div>
            )}

            <ProductGallery
              images={product.images}
              productName={product.name}
            />

          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            {/* Category */}
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {product.name}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-8 border-y border-black/10 py-6">

              <div className="flex flex-wrap items-center gap-4">

                <span className="text-3xl font-bold">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {product.mrp > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString("en-IN")}
                  </span>
                )}

                {discount > 0 && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                    Save {discount}%
                  </span>
                )}

              </div>

              <p className="mt-2 text-xs text-gray-500">
                Inclusive of applicable taxes
              </p>

            </div>

            {/* Inventory */}
            <div className="mt-6">

              {isInStock ? (
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  In Stock
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  Currently Out of Stock
                </div>
              )}

              {isInStock && product.inventory <= 5 && (
                <p className="mt-2 text-xs text-orange-600">
                  Only {product.inventory} left in stock
                </p>
              )}

            </div>

            {/* Add To Cart / Quantity */}
            <div className="mt-7">
              <ProductActions product={product} />
            </div>

            {/* Trust Information */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-black/10 pt-6">

              <div className="text-center">
                <p className="text-lg">✦</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                  Handcrafted
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg">◇</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                  Quality
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg">⌂</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                  Made for Home
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Product Information */}
      <section className="border-t border-black/10 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-12">

          <div className="grid gap-8 md:grid-cols-3">

            <div>
              <h2 className="font-serif text-xl font-bold">
                Crafted with Character
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Discover distinctive pieces selected to bring
                warmth, personality and timeless character to your
                home.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold">
                A Thoughtful Choice
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Every BLR Seasonals piece is chosen with an eye
                for craftsmanship, character and lasting appeal.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold">
                Need Help?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Have a question about this product? Our customer
                support experience will be added as we complete
                the store.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}