import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900">
      {/* Header */}
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

      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Get In Touch
            </p>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              We&apos;d love to
              <br />
              hear from you.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Have a question about a product, an order, gifting, or our
              collections? Send us a message and we&apos;ll be happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="border-t border-black/10 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact Details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Contact Details
            </p>

            <h2 className="mt-4 font-serif text-3xl font-bold">
              Let&apos;s connect.
            </h2>

            <p className="mt-4 max-w-md leading-7 text-gray-600">
              Whether you&apos;re looking for something special for your home
              or need help with an order, our team is here to assist.
            </p>

            <div className="mt-10 space-y-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Location
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-800">
                  Bengaluru, Karnataka
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-800">
                  We&apos;ll add our official email address here.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer Support
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-800">
                  For product and order enquiries, please use the enquiry form.
                </p>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="rounded-3xl border border-black/10 bg-[#faf7f2] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Send An Enquiry
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold">
              How can we help?
            </h2>

            <form className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                  Mobile Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-semibold">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="" disabled>
                    Select an enquiry type
                  </option>
                  <option value="product">Product Enquiry</option>
                  <option value="order">Order Support</option>
                  <option value="gifting">Gifting</option>
                  <option value="custom">Custom Requirement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-black px-6 py-16 text-center text-white md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Discover BLR Seasonals
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            Find something timeless.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-300">
            Explore handcrafted décor, antique-inspired pieces, collectibles,
            showpieces and seasonal collections.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Explore Products
          </Link>
        </div>
      </section>

      {/* Footer */}
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
            <Link href="/products" className="transition hover:text-black">
              Shop
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
