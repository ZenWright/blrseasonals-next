import Link from "next/link";

type SeasonalCollection = {
  id: number;
  name: string;
  description: string;
  is_active: number;
  start_date: string | null;
  end_date: string | null;
};

async function getSeasonalCollections(): Promise<
  SeasonalCollection[]
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seasonal-collections`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch seasonal collections from FastAPI"
    );
  }

  return response.json();
}

export default async function SeasonalCollectionsPage() {
  const collections =
    await getSeasonalCollections();

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


          <div className="flex items-center gap-6">

            <Link
              href="/"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Shop
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          Page Introduction
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-14 pt-16 md:pb-20 md:pt-24">

        <div className="max-w-3xl">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            BLR Seasonals
          </p>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-6xl">
            Seasonal Collections
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Explore thoughtfully curated collections created
            for celebrations, gifting and distinctive spaces
            throughout the year.
          </p>

        </div>

      </section>


      {/* =====================================================
          Collections
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-24">

        {collections.length > 0 ? (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {collections.map((collection) => (

              <Link
                key={collection.id}
                href={`/products?collection=${encodeURIComponent(
                  collection.name
                )}`}
                className="group rounded-3xl border border-black/10 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl transition group-hover:bg-black group-hover:text-white">
                  ✦
                </div>


                <h2 className="mt-7 font-serif text-2xl font-bold">
                  {collection.name}
                </h2>


                <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-600">
                  {collection.description}
                </p>


                <div className="mt-7 flex items-center text-sm font-semibold text-gray-900">
                  Explore Collection
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>

              </Link>

            ))}

          </div>

        ) : (

          <div className="rounded-3xl border border-black/10 bg-white px-6 py-20 text-center">

            <h2 className="font-serif text-2xl font-bold">
              Seasonal Collections Coming Soon
            </h2>

            <p className="mt-3 text-gray-600">
              New seasonal collections will appear here soon.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          Information Section
      ===================================================== */}

      <section className="border-y border-black/10 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Curated for Every Season
            </p>

            <h2 className="mt-4 font-serif text-3xl font-bold md:text-4xl">
              Discover something distinctive
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Our seasonal collections bring together distinctive
              décor, antique-inspired pieces, collectibles and
              gifting ideas selected for special occasions and
              everyday spaces.
            </p>

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

          <div className="flex gap-5">

            <Link
              href="/"
              className="transition hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="transition hover:text-black"
            >
              Shop
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}