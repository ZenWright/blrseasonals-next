"use client";

import Link from "next/link";
import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { useCart } from "@/context/CartContext";


type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};


type FormErrors = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};


export default function CheckoutPage() {

  const {
    cartItems,
    cartSubtotal,
  } = useCart();


  // =========================================================
  // Form State
  // =========================================================

  const [form, setForm] =
    useState<CheckoutForm>({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });


  // =========================================================
  // Validation Errors
  // =========================================================

  const [errors, setErrors] =
    useState<FormErrors>({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });


  // =========================================================
  // Submit State
  // =========================================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  // =========================================================
  // Shipping Rules
  // =========================================================

  const FREE_SHIPPING_THRESHOLD = 1000;

  const STANDARD_SHIPPING = 99;


  const shippingCost =
    cartSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING;


  const orderTotal =
    cartSubtotal + shippingCost;


  // =========================================================
  // Format Price
  // =========================================================

  const formatPrice = (price: number) => {

    return `₹${price.toLocaleString("en-IN")}`;

  };


  // =========================================================
  // Handle Input Changes
  // =========================================================

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm((current) => ({
      ...current,
      [name]: value,
    }));


    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

  };


  // =========================================================
  // Validate Form
  // =========================================================

  const validateForm = () => {

    const newErrors: FormErrors = {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    };


    // -------------------------------------------------------
    // Name
    // -------------------------------------------------------

    if (!form.name.trim()) {

      newErrors.name =
        "Please enter your full name.";

    } else if (
      form.name.trim().length < 2
    ) {

      newErrors.name =
        "Please enter a valid name.";

    }


    // -------------------------------------------------------
    // Mobile
    // -------------------------------------------------------

    if (!form.phone.trim()) {

      newErrors.phone =
        "Please enter your mobile number.";

    } else if (
      !/^[6-9]\d{9}$/.test(
        form.phone.trim()
      )
    ) {

      newErrors.phone =
        "Please enter a valid 10-digit Indian mobile number.";

    }


    // -------------------------------------------------------
    // Email
    // -------------------------------------------------------

    if (!form.email.trim()) {

      newErrors.email =
        "Please enter your email address.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {

      newErrors.email =
        "Please enter a valid email address.";

    }


    // -------------------------------------------------------
    // Address
    // -------------------------------------------------------

    if (!form.address.trim()) {

      newErrors.address =
        "Please enter your delivery address.";

    } else if (
      form.address.trim().length < 10
    ) {

      newErrors.address =
        "Please enter a more complete delivery address.";

    }


    // -------------------------------------------------------
    // City
    // -------------------------------------------------------

    if (!form.city.trim()) {

      newErrors.city =
        "Please enter your city.";

    }


    // -------------------------------------------------------
    // State
    // -------------------------------------------------------

    if (!form.state.trim()) {

      newErrors.state =
        "Please enter your state.";

    }


    // -------------------------------------------------------
    // PIN Code
    // -------------------------------------------------------

    if (!form.pincode.trim()) {

      newErrors.pincode =
        "Please enter your PIN code.";

    } else if (
      !/^\d{6}$/.test(
        form.pincode.trim()
      )
    ) {

      newErrors.pincode =
        "PIN code must contain exactly 6 digits.";

    }


    setErrors(newErrors);


    return !Object.values(newErrors).some(
      (error) => error !== ""
    );

  };


  // =========================================================
  // Submit Order
  // =========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    // -------------------------------------------------------
    // Validate Form
    // -------------------------------------------------------

    if (!validateForm()) {

      return;

    }


    // -------------------------------------------------------
    // Make Sure Cart Has Products
    // -------------------------------------------------------

    if (cartItems.length === 0) {

      alert(
        "Your cart is empty."
      );

      return;

    }


    setIsSubmitting(true);


    try {

      // =====================================================
      // Send Order to FastAPI
      // =====================================================

      /*
       * IMPORTANT:
       *
       * We send only:
       *
       * - Customer details
       * - Product IDs
       * - Quantities
       *
       * FastAPI gets the real product prices
       * from MySQL.
       *
       * FastAPI calculates:
       *
       * - Subtotal
       * - Shipping
       * - Total
       *
       * This prevents the frontend from controlling
       * the final order price.
       */

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            customer_name:
              form.name.trim(),

            mobile:
              form.phone.trim(),

            email:
              form.email.trim(),

            address:
              form.address.trim(),

            city:
              form.city.trim(),

            state:
              form.state.trim(),

            pincode:
              form.pincode.trim(),

            items:
              cartItems.map((item) => ({
                product_id:
                  Number(item.product.id),

                quantity:
                  item.quantity,
              })),

          }),
        }
      );


      // =====================================================
      // Read API Response
      // =====================================================

      const data =
        await response.json();


      // =====================================================
      // Handle API Error
      // =====================================================

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Failed to create order."
        );

      }


      // =====================================================
      // Verify Order Number
      // =====================================================

      if (!data.order_number) {

        throw new Error(
          "Order was created but no order number was returned."
        );

      }


      // =====================================================
// Create Cashfree Payment
// =====================================================

const paymentResponse = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/payments/create`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_number: data.order_number,
      return_url:
        `${window.location.origin}/payment-return?orderId=${encodeURIComponent(
          data.order_number
        )}`,
    }),
  }
);

const paymentData = await paymentResponse.json();

if (!paymentResponse.ok) {
  throw new Error(
    paymentData.detail ||
      "Unable to start payment."
  );
}

if (!paymentData.payment_session_id) {
  throw new Error(
    "Payment session was not created."
  );
}

// =====================================================
// Open Cashfree Checkout
// =====================================================

const cashfree = await load({
  mode: "production",
});

if (!cashfree) {
  throw new Error(
    "Cashfree payment system could not be loaded."
  );
}

await cashfree.checkout({
  paymentSessionId:
    paymentData.payment_session_id,
});


    } catch (error) {

      console.error(
        "Failed to create order:",
        error
      );


      setIsSubmitting(false);


      const message =
        error instanceof Error
          ? error.message
          : "We could not create your order.";


      alert(message);

    }

  };


  // =========================================================
  // Empty Cart
  // =========================================================

  if (cartItems.length === 0) {

    return (

      <main className="min-h-screen bg-[#faf7f2] text-gray-900">


        {/* Header */}

        <header className="border-b border-black/10 bg-[#faf7f2]">

          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

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


            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              ← Continue Shopping
            </Link>

          </div>

        </header>


        {/* Empty Cart */}

        <section className="mx-auto max-w-3xl px-6 py-20">

          <div className="rounded-3xl border border-black/10 bg-white px-6 py-20 text-center">

            <div className="text-5xl">
              🛒
            </div>


            <h1 className="mt-6 font-serif text-3xl font-bold">
              Your Cart Is Empty
            </h1>


            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
              Add some products to your cart before proceeding to checkout.
            </p>


            <Link
              href="/products"
              className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Browse Products
            </Link>

          </div>

        </section>

      </main>

    );

  }


  // =========================================================
  // Main Checkout Page
  // =========================================================

  return (

    <main className="min-h-screen bg-[#faf7f2] text-gray-900">


      {/* =====================================================
          Header
      ===================================================== */}

      <header className="border-b border-black/10 bg-[#faf7f2]">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

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


          <Link
            href="/cart"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            ← Back to Cart
          </Link>

        </div>

      </header>


      {/* =====================================================
          Heading
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 md:pt-16">

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          BLR Seasonals
        </p>


        <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">
          Checkout
        </h1>


        <p className="mt-3 max-w-2xl text-gray-600">
          Enter your delivery details to continue with your order.
        </p>

      </section>


      {/* =====================================================
          Checkout Section
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-6 pb-20">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">


          {/* =================================================
              Customer Details
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-black/10 bg-white p-6 md:p-8"
          >

            <h2 className="font-serif text-2xl font-bold">
              Delivery Details
            </h2>


            <p className="mt-2 text-sm text-gray-500">
              Please provide the information needed to deliver your order.
            </p>


            {/* =================================================
                Name
            ================================================= */}

            <div className="mt-8">

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold"
              >
                Full Name
              </label>


              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Enter your full name"
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-black ${
                  errors.name
                    ? "border-red-500"
                    : "border-black/15"
                }`}
              />


              {errors.name && (

                <p className="mt-2 text-xs text-red-600">
                  {errors.name}
                </p>

              )}

            </div>


            {/* =================================================
                Phone + Email
            ================================================= */}

            <div className="mt-5 grid gap-5 md:grid-cols-2">


              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Mobile Number
                </label>


                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-black ${
                    errors.phone
                      ? "border-red-500"
                      : "border-black/15"
                  }`}
                />


                {errors.phone && (

                  <p className="mt-2 text-xs text-red-600">
                    {errors.phone}
                  </p>

                )}

              </div>


              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>


                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-black ${
                    errors.email
                      ? "border-red-500"
                      : "border-black/15"
                  }`}
                />


                {errors.email && (

                  <p className="mt-2 text-xs text-red-600">
                    {errors.email}
                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                Address
            ================================================= */}

            <div className="mt-5">

              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold"
              >
                Delivery Address
              </label>


              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                autoComplete="street-address"
                rows={4}
                placeholder="House / Flat number, street, area..."
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-black ${
                  errors.address
                    ? "border-red-500"
                    : "border-black/15"
                }`}
              />


              {errors.address && (

                <p className="mt-2 text-xs text-red-600">
                  {errors.address}
                </p>

              )}

            </div>


            {/* =================================================
                City / State / PIN
            ================================================= */}

            <div className="mt-5 grid gap-5 md:grid-cols-3">


              {/* City */}

              <div>

                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold"
                >
                  City
                </label>


                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  required
                  autoComplete="address-level2"
                  placeholder="City"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-black ${
                    errors.city
                      ? "border-red-500"
                      : "border-black/15"
                  }`}
                />


                {errors.city && (

                  <p className="mt-2 text-xs text-red-600">
                    {errors.city}
                  </p>

                )}

              </div>


              {/* State */}

              <div>

                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-semibold"
                >
                  State
                </label>


                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  required
                  autoComplete="address-level1"
                  placeholder="State"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-black ${
                    errors.state
                      ? "border-red-500"
                      : "border-black/15"
                  }`}
                />


                {errors.state && (

                  <p className="mt-2 text-xs text-red-600">
                    {errors.state}
                  </p>

                )}

              </div>


              {/* PIN */}

              <div>

                <label
                  htmlFor="pincode"
                  className="mb-2 block text-sm font-semibold"
                >
                  PIN Code
                </label>


                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  autoComplete="postal-code"
                  maxLength={6}
                  placeholder="560001"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-black ${
                    errors.pincode
                      ? "border-red-500"
                      : "border-black/15"
                  }`}
                />


                {errors.pincode && (

                  <p className="mt-2 text-xs text-red-600">
                    {errors.pincode}
                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                Submit
            ================================================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full rounded-xl bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isSubmitting
  ? "Opening Payment..."
  : "Continue to Payment"}

            </button>


            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
  You will be securely redirected to Cashfree to complete your payment.
</p>

          </form>


          {/* =================================================
              Order Summary
          ================================================= */}

          <aside className="h-fit rounded-2xl border border-black/10 bg-white p-6 lg:sticky lg:top-6">

            <h2 className="font-serif text-2xl font-bold">
              Order Summary
            </h2>


            {/* =================================================
                Products
            ================================================= */}

            <div className="mt-6 space-y-4">

              {cartItems.map((item) => {

                const product =
                  item.product;

                const itemTotal =
                  product.price *
                  item.quantity;


                return (

                  <div
                    key={product.id}
                    className="flex gap-4 border-b border-black/10 pb-4"
                  >


                    {/* Product Image */}

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">

                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                      />

                    </div>


                    {/* Product Information */}

                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-semibold">
                        {product.name}
                      </p>


                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>


                      <p className="mt-2 text-sm font-semibold">
                        {formatPrice(itemTotal)}
                      </p>

                    </div>

                  </div>

                );

              })}

            </div>


            {/* =================================================
                Totals
            ================================================= */}

            <div className="mt-6 space-y-4 border-b border-black/10 pb-6">


              {/* Subtotal */}

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-600">
                  Subtotal
                </span>


                <span className="font-semibold">
                  {formatPrice(cartSubtotal)}
                </span>

              </div>


              {/* Shipping */}

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-600">
                  Shipping
                </span>


                {shippingCost === 0 ? (

                  <span className="font-semibold text-green-700">
                    FREE
                  </span>

                ) : (

                  <span className="font-semibold">
                    {formatPrice(shippingCost)}
                  </span>

                )}

              </div>

            </div>


            {/* =================================================
                Free Shipping Message
            ================================================= */}

            {shippingCost > 0 && (

              <div className="mt-5 rounded-xl bg-[#faf7f2] p-4">

                <p className="text-xs leading-5 text-gray-600">

                  Add{" "}

                  <span className="font-semibold text-gray-900">

                    {formatPrice(
                      FREE_SHIPPING_THRESHOLD -
                      cartSubtotal
                    )}

                  </span>{" "}

                  more to get FREE shipping.

                </p>

              </div>

            )}


            {shippingCost === 0 && (

              <div className="mt-5 rounded-xl bg-green-50 p-4">

                <p className="text-xs font-semibold text-green-700">
                  🎉 You qualify for FREE shipping!
                </p>

              </div>

            )}


            {/* =================================================
                Total
            ================================================= */}

            <div className="mt-6 flex items-center justify-between">

              <span className="font-semibold">
                Total
              </span>


              <span className="text-2xl font-bold">
                {formatPrice(orderTotal)}
              </span>

            </div>


            {/* =================================================
                Security
            ================================================= */}

            <div className="mt-7 rounded-xl bg-[#faf7f2] p-4">

              <p className="text-sm font-semibold">
                Secure Checkout
              </p>


              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your order details will be handled securely. Payment
                processing will be connected before production launch.
              </p>

            </div>

          </aside>

        </div>

      </section>


      {/* =====================================================
          Footer
      ===================================================== */}

      <footer className="border-t border-black/10 bg-white">

        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} BLR Seasonals. All rights reserved.
          </p>


          <Link
            href="/products"
            className="transition hover:text-black"
          >
            Continue Shopping
          </Link>

        </div>

      </footer>

    </main>

  );

}