import Link from "next/link";

const sections = [
  {
    title: "Shipping Charges",
    content: (
      <>
        <p>
          Orders below ₹1,000 currently have a standard shipping charge of
          ₹99.
        </p>
        <p>
          Orders of ₹1,000 or more qualify for free shipping.
        </p>
      </>
    ),
  },
  {
    title: "Order Processing",
    content: (
      <p>
        Orders are processed after successful order confirmation. Processing
        time may vary depending on product availability and the nature of the
        order.
      </p>
    ),
  },
  {
    title: "Delivery",
    content: (
      <p>
        Delivery timelines can vary depending on your location, product
        availability, courier service, and other factors. The applicable
        delivery information will be communicated as part of the order
        process.
      </p>
    ),
  },
  {
    title: "Order Cancellation",
    content: (
      <p>
        If you need to cancel an order, please contact us as soon as possible
        with your order number. Cancellation may not be possible once an order
        has been processed or shipped.
      </p>
    ),
  },
  {
    title: "Returns & Replacements",
    content: (
      <p>
        Return and replacement eligibility depends on the product and the
        circumstances of the request. Our final return conditions will be
        confirmed before the website goes live.
      </p>
    ),
  },
  {
    title: "Damaged or Incorrect Product",
    content: (
      <p>
        If you receive a damaged, defective, or incorrect product, please
        contact us as soon as possible with your order number and relevant
        details so that we can review the issue and assist you.
      </p>
    ),
  },
  {
    title: "How to Contact Us",
    content: (
      <p>
        For shipping, delivery, cancellation, or return-related questions,
        please use our Contact page and provide your order number whenever
        applicable.
      </p>
    ),
  },
];

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="border-b border-black/10 bg-[#faf7f2]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
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
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Shop
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Customer Information
            </p>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Shipping &
              <br />
              Returns.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Everything you need to know about shipping, delivery,
              cancellations, returns, and replacements at BLR Seasonals.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK SHIPPING INFO
      ===================================================== */}
      <section className="border-y border-black/10 bg-white px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-[#faf7f2] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Standard Shipping
            </p>

            <p className="mt-3 font-serif text-2xl font-bold">
              ₹99
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              For orders below ₹1,000.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7f2] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Free Shipping
            </p>

            <p className="mt-3 font-serif text-2xl font-bold">
              ₹1,000+
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Free shipping on qualifying orders.
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf7f2] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Need Help?
            </p>

            <p className="mt-3 font-serif text-2xl font-bold">
              Contact Us
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              We&apos;re here to help with your order.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          POLICY SECTIONS
      ===================================================== */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-5">
            {sections.map((section, index) => (
              <section
                key={section.title}
                className="rounded-2xl border border-black/10 bg-white p-6 md:p-8"
              >
                <div className="flex gap-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl font-bold">
                      {section.title}
                    </h2>

                    <div className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
                      {section.content}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          IMPORTANT NOTE
      ===================================================== */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Policy Notice
          </p>

          <p className="mt-3 text-sm leading-7 text-amber-900">
            The return, replacement, cancellation, and delivery terms on this
            page are currently a general customer-information framework. The
            final business policy should be reviewed and confirmed before
            publishing the website for production use.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
      ===================================================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-black px-6 py-16 text-center text-white md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Need Assistance?
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            We&apos;re here to help.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-300">
            Have a question about your order, delivery, or a product?
            Get in touch with the BLR Seasonals team.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-black/10 bg-[#faf7f2] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} BLR Seasonals. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link href="/" className="transition hover:text-black">
              Home
            </Link>

            <Link href="/about" className="transition hover:text-black">
              About
            </Link>

            <Link href="/contact" className="transition hover:text-black">
              Contact
            </Link>

            <Link href="/faq" className="transition hover:text-black">
              FAQ
            </Link>

            <Link href="/products" className="transition hover:text-black">
              Shop
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}