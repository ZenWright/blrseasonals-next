import Link from "next/link";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, open the product you like, add it to your cart, and proceed to checkout. Enter your delivery details and complete the order.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Payment options will be shown during checkout based on the payment methods available for your order and delivery location.",
  },
  {
    question: "What are the shipping charges?",
    answer:
      "Orders below ₹1,000 currently have a standard shipping charge of ₹99. Orders of ₹1,000 or more qualify for free shipping.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time can vary depending on your location, product availability, and courier service. The applicable delivery information will be provided during the ordering process.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "If you need to cancel an order, please contact us as soon as possible with your order number. Cancellation availability may depend on whether the order has already been processed or shipped.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Our final return and replacement policy will be published on the Shipping & Returns page. Please check that policy before placing an order.",
  },
  {
    question: "Are the products handmade or unique?",
    answer:
      "Many of our products are handcrafted, vintage-inspired, antique-style, or individually selected pieces. Because of this, minor variations in appearance may occur between pieces.",
  },
  {
    question: "How can I contact BLR Seasonals?",
    answer:
      "You can contact us through our Contact page for product enquiries, order support, gifting requirements, and other questions.",
  },
];

export default function FAQPage() {
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
              Frequently Asked Questions
            </p>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Questions,
              <br />
              answered.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Find answers to common questions about ordering, shipping,
              products, returns, and contacting BLR Seasonals.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ LIST
      ===================================================== */}
      <section className="border-t border-black/10 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-black/10 bg-[#faf7f2] transition hover:border-black/20"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-base font-semibold md:px-7">
                  <span>
                    {index + 1}. {faq.question}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-lg transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="px-6 pb-6 md:px-7">
                  <p className="max-w-3xl text-sm leading-7 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
      ===================================================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-black px-6 py-16 text-center text-white md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Still Have Questions?
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            We&apos;re here to help.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-300">
            If you couldn&apos;t find the answer you&apos;re looking for,
            send us an enquiry and our team will be happy to assist.
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

            <Link href="/products" className="transition hover:text-black">
              Shop
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}