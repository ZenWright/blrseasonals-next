import Link from "next/link";

const sections = [
  {
    title: "Information We Collect",
    content: (
      <>
        <p>
          When you place an order or contact us, we may collect information
          such as your name, mobile number, email address, delivery address,
          city, state, and pincode.
        </p>

        <p>
          We collect only the information reasonably required to process
          orders, provide customer support, and operate our website.
        </p>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <>
        <p>Your information may be used to:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Process and fulfil your orders.</li>
          <li>Arrange delivery of purchased products.</li>
          <li>Communicate with you about your order.</li>
          <li>Respond to customer enquiries and support requests.</li>
          <li>Improve our products, services, and website experience.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Payment Information",
    content: (
      <p>
        Payment information may be processed through our selected payment
        service provider. BLR Seasonals does not intend to store complete
        payment card details on its own systems.
      </p>
    ),
  },
  {
    title: "Order Information",
    content: (
      <p>
        When you place an order, relevant customer and order information is
        stored so that we can process the order, manage inventory, arrange
        delivery, and provide order support.
      </p>
    ),
  },
  {
    title: "Sharing of Information",
    content: (
      <p>
        We may share necessary information with service providers involved in
        fulfilling your order, such as delivery and payment service providers.
        We do not intend to sell your personal information to third parties.
      </p>
    ),
  },
  {
    title: "Data Security",
    content: (
      <p>
        We take reasonable measures to protect customer information from
        unauthorized access, misuse, alteration, or disclosure. However, no
        internet-based system can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    title: "Cookies and Website Usage",
    content: (
      <p>
        Our website may use browser storage and similar technologies to provide
        functionality such as maintaining your shopping cart and improving the
        website experience.
      </p>
    ),
  },
  {
    title: "Your Choices",
    content: (
      <p>
        If you have questions about the personal information associated with
        your order or would like to request assistance regarding your
        information, please contact BLR Seasonals through our Contact page.
      </p>
    ),
  },
  {
    title: "Policy Updates",
    content: (
      <p>
        We may update this Privacy Policy from time to time as our website,
        services, or business processes change. The latest version will be
        published on this page.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
              Your Privacy Matters
            </p>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Privacy
              <br />
              Policy.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              This page explains how BLR Seasonals collects, uses, and protects
              information provided through our website and during the ordering
              process.
            </p>

            <p className="mt-5 text-sm text-gray-500">
              Last updated: September 2026
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          POLICY CONTENT
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

                    <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600">
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
            This Privacy Policy is currently a general website-policy draft.
            Before BLR Seasonals goes live, the final policy should be reviewed
            and updated to reflect the actual business structure, payment
            providers, hosting services, analytics tools, communication
            services, and applicable legal requirements.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
      ===================================================== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-black px-6 py-16 text-center text-white md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Questions About Privacy?
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            We&apos;re here to help.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-300">
            If you have a question about how your information is handled,
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
          </div>
        </div>
      </footer>
    </main>
  );
}