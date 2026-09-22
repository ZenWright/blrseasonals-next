import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fdf8f3] text-stone-900">

      {/* =====================================================
          Header
      ===================================================== */}

      <header className="border-b border-stone-200 bg-[#fdf8f3]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/" className="group">

            <h1 className="font-serif text-2xl font-bold transition group-hover:opacity-70">
              BLR Seasonals
            </h1>

            <p className="text-xs uppercase tracking-widest text-stone-500">
              Handcrafted · Est. 2024
            </p>

          </Link>

          <Link
            href="/products"
            className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-black hover:bg-black hover:text-white"
          >
            Shop
          </Link>

        </div>

      </header>


      {/* =====================================================
          Hero
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
          About BLR Seasonals
        </p>

        <h2 className="mx-auto mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-6xl">
          Timeless pieces.
          <br />
          Distinctive character.
        </h2>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-stone-600">
          BLR Seasonals brings together distinctive décor,
          antique-inspired pieces, collectibles and seasonal
          finds selected to add character to everyday spaces.
        </p>

      </section>


      {/* =====================================================
          Brand Story
      ===================================================== */}

      <section className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                Our Story
              </p>

              <h2 className="mt-4 font-serif text-4xl font-semibold">
                A collection built around character
              </h2>

            </div>

            <div className="space-y-5 text-stone-600 leading-relaxed">

              <p>
                We believe a home becomes more memorable through
                the pieces that have a story, a sense of character
                or simply make you stop and look twice.
              </p>

              <p>
                BLR Seasonals was created to bring together a
                changing selection of distinctive products across
                décor, collectibles, antique-inspired pieces and
                seasonal gifting.
              </p>

              <p>
                Rather than limiting ourselves to one style or
                category, we continuously curate pieces that feel
                interesting, useful and worthy of a place in your
                space.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          What We Offer
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
            What We Offer
          </p>

          <h2 className="mt-4 font-serif text-4xl font-semibold">
            Something distinctive for every space
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            Explore a growing selection of pieces across
            different categories and collections.
          </p>

        </div>


        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {[
            {
              title: "Décor & Showpieces",
              description:
                "Distinctive pieces designed to add personality and character to your space.",
            },
            {
              title: "Antique-Inspired Pieces",
              description:
                "Vintage and heritage-inspired designs with timeless visual appeal.",
            },
            {
              title: "Collectibles",
              description:
                "Interesting pieces selected for display, gifting and personal collections.",
            },
            {
              title: "Wooden Creations",
              description:
                "Handcrafted wooden pieces that bring warmth and character to interiors.",
            },
            {
              title: "Seasonal Collections",
              description:
                "Curated selections created around festivals, occasions and changing seasons.",
            },
            {
              title: "Gifting",
              description:
                "Thoughtful and distinctive pieces for people and occasions that matter.",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="font-serif text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          Our Approach
      ===================================================== */}

      <section className="bg-stone-900 py-20 text-white">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">
            Our Approach
          </p>

          <h2 className="mt-5 font-serif text-4xl font-semibold md:text-5xl">
            Curated, distinctive and always evolving.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-stone-300">
            Our collections are designed to evolve with seasons,
            occasions and new discoveries. We want every visit to
            BLR Seasonals to offer something worth exploring.
          </p>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="rounded-3xl border border-stone-200 bg-white px-8 py-14 text-center md:px-16">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
            Discover BLR Seasonals
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold">
            Find something that feels like it belongs in your space.
          </h2>

          <Link
            href="/products"
            className="mt-8 inline-flex rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Explore Products
          </Link>

        </div>

      </section>


      {/* =====================================================
          Footer
      ===================================================== */}

{/* Location */}
<section className="mx-auto max-w-7xl px-6 py-16">
  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8 md:p-10">
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
        Visit Us
      </p>

      <h2 className="mt-3 font-serif text-3xl font-semibold text-stone-900">
        Find BLR Seasonals
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
        8/2, Mary's Layout, 1st Cross St, Nagawara Main Rd,
        Nagawara, Bengaluru, Karnataka – 560045
      </p>

      <a
        href="https://maps.app.goo.gl/dnMaQzBaafsspPyu5"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
      >
        View Our Location on Google Maps →
      </a>
    </div>
  </div>
</section>

      <footer className="border-t border-stone-200">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <div className="text-center md:text-left">

              <p className="font-serif text-lg font-semibold">
                BLR Seasonals
              </p>

              <p className="mt-1 text-xs text-stone-500">
                Distinctive pieces for every season.
              </p>

            </div>

            <Link
              href="/"
              className="text-sm text-stone-500 transition hover:text-black"
            >
              Back to Home
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}