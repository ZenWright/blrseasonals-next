import Link from "next/link";

const sections = [
  {
    title: "Website Use",
    content: (
      <p>
        By using the BLR Seasonals website, you agree to use the website
        responsibly and in accordance with applicable laws and these Terms &
        Conditions.
      </p>
    ),
  },
  {
    title: "Products & Product Information",
    content: (
      <p>
        We make reasonable efforts to display product descriptions, images,
        prices, and availability accurately. However, minor variations in
        colour, finish, texture, size, or appearance may occur, particularly
        with handcrafted, vintage-inspired, or individually selected pieces.
      </p>
    ),
  },
  {
    title: "Pricing",
    content: (
      <p>
        Product prices displayed on the website are subject to change without
        prior notice. The price applicable to an order is the price displayed
        at the time the order is successfully placed, subject to any applicable
        taxes or charges shown during checkout.
      </p>
    ),
  },
  {
    title: "Orders",
    content: (
      <p>
        Placing an order constitutes a request to purchase the selected
        products. An order is subject to product availability, successful
        processing, and confirmation. We reserve the right to cancel or
        decline an order where necessary, including in cases of inventory
        issues or suspected errors.
      </p>
    ),
  },
  {
    title: "Payments",
    content: (
      <p>
        Payments may be processed through third-party payment service
        providers. Customers are responsible for providing accurate payment
        and billing information when required.
      </p>
    ),
  },
  {
    title: "Inventory & Availability",
    content: (
      <p>
        Product availability can change without notice. If an item becomes
        unavailable after an order is placed, we may contact the customer and
        provide an appropriate resolution.
      </p>
    ),
  },
  {
    title: "Shipping & Delivery",
    content: (
      <p>
        Shipping and delivery are subject to the terms described on our
        Shipping & Returns page. Delivery timelines are estimates and may vary
        based on location, courier service, product availability, and other
        circumstances.
      </p>
    ),
  },
  {
    title: "Cancellations, Returns & Replacements",
    content: (
      <p>
        Order cancellations, returns, and replacements are governed by our
        Shipping & Returns policy. Customers should review that policy before
        placing an order.
      </p>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <p>
        Website content including text, product descriptions, graphics,
        branding, logos, photographs, and other materials may belong to BLR
        Seasonals or its respective content providers and should not be
        reproduced or used without appropriate permission.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        To the extent permitted by applicable law, BLR Seasonals will not be
        responsible for losses arising from circumstances outside our
        reasonable control, including courier delays, service interruptions,
        technical issues, or events beyond our control.
      </p>
    ),
  },
  {
    title: "Changes to These Terms",
    content: (
      <p>
        We may update these Terms & Conditions when our website, products,
        services, or business processes change. Updated terms will be
        published on this page.
      </p>
    ),
  },
  {
    title: "Contact",
    content: (
      <p>
        If you have questions about these Terms & Conditions, orders, products,
        or our services, please contact BLR Seasonals through our Contact page.
      </p>
    ),
  },
];

export default function TermsPage() {
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
              Website Terms
            </p>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Terms &
              <br />
              Conditions.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              These terms describe the general conditions for using the BLR
              Seasonals website, purchasing products, and interacting with our
              services.
            </p>

            <p className="mt-5 text-sm text-gray-500">
              Last updated: September 2026
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TERMS CONTENT
      ===================================================== */}
      <section className="border-t border-black/10 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-5">
            {sections.map((section, index) => (
              <section
                key={section.title}
                className="rounded-2xl border border-black/10 bg-[#faf7f2] p-6 md:p-8"
              >
                <div className="flex gap-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl font-bold">
                      {section.title}
                    </h2>

                    <div className="mt-4 text-sm leading-7 text-gray-600">
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
          IMPORTANT NOTICE
      ===================================================== */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Important Notice
          </p>

          <p className="mt-3 text-sm leading-7 text-amber-900">
            This Terms & Conditions page is currently a general business-policy
            draft. Before BLR Seasonals goes live, the final terms should be
            reviewed and updated to reflect the actual business structure,
            payment methods, shipping arrangements, return policy, and
            applicable legal requirements.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
      ===================================================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-black px-6 py-16 text-center text-white md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Need Help?
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            Have a question?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-300">
            If you have any questions about our terms, products, or orders,
            please get in touch with us.
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

          <div className="flex flex-wrap gap-5">
            <Link href="/" className="transition hover:text-black">
              Home
            </Link>

            <Link href="/about" className="transition hover:text-black">
              About
            </Link>

            <Link href="/products" className="transition hover:text-black">
              Shop
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
          </div>
        </div>
      </footer>
    </main>
  );
}