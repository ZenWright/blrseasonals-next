"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type Order = {
  orderId: string;

  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  items: OrderItem[];

  subtotal: number;
  shipping: number;
  total: number;

  status: string;
  paymentStatus: string;

  createdAt: string | null;
};

type OrderApiResponse = {
  success: boolean;
  order: Order;
};


function OrderConfirmationContent() {

  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");


  // =========================================================
  // Load Order From FastAPI / MySQL
  // =========================================================

  useEffect(() => {

    async function loadOrder() {

      // -----------------------------------------------------
      // Check order ID
      // -----------------------------------------------------

      if (!orderId) {

        setErrorMessage(
          "No order ID was provided."
        );

        setIsLoading(false);

        return;
      }


      try {

        setIsLoading(true);

        setErrorMessage("");


        // ---------------------------------------------------
        // Get order from FastAPI
        // ---------------------------------------------------

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${encodeURIComponent(orderId)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },

            // Always request the latest order
            cache: "no-store",
          }
        );


        const data: OrderApiResponse | { detail?: string } =
          await response.json();


        // ---------------------------------------------------
        // Handle API error
        // ---------------------------------------------------

        if (!response.ok) {

          const detail =
            "detail" in data && data.detail
              ? data.detail
              : "Order could not be found.";

          throw new Error(detail);
        }


        // ---------------------------------------------------
        // Save order from database
        // ---------------------------------------------------

        if ("order" in data && data.order) {

          setOrder(data.order);

        } else {

          throw new Error(
            "Invalid order response from server."
          );
        }

      } catch (error) {

        console.error(
          "Failed to load order:",
          error
        );

        setOrder(null);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "We could not load your order."
        );

      } finally {

        setIsLoading(false);
      }
    }


    loadOrder();

  }, [orderId]);


  // =========================================================
  // Format Price
  // =========================================================

  const formatPrice = (price: number) => {

    return `₹${Number(price).toLocaleString("en-IN")}`;

  };


  // =========================================================
  // Loading State
  // =========================================================

  if (isLoading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />

          <p className="mt-5 text-sm text-gray-500">
            Loading your order...
          </p>

        </div>

      </main>

    );
  }


  // =========================================================
  // Order Not Found
  // =========================================================

  if (!order) {

    return (

      <main className="min-h-screen bg-[#faf7f2] px-6 py-20 text-gray-900">

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            BLR Seasonals
          </p>


          <h1 className="mt-5 font-serif text-4xl font-bold">
            Order Not Found
          </h1>


          <p className="mt-4 text-gray-600">
            {errorMessage ||
              "We could not find this order."}
          </p>


          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>

        </div>

      </main>

    );
  }


  // =========================================================
  // Main Confirmation Page
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
            href="/products"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Continue Shopping
          </Link>

        </div>

      </header>


      {/* =====================================================
          Confirmation Section
      ===================================================== */}

      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">


        {/* ===================================================
            Success Message
        =================================================== */}

        <div className="rounded-3xl border border-black/10 bg-white p-6 text-center md:p-10">


          {/* Success Icon */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>


          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Order Created
          </p>


          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Thank You!
          </h1>


          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
            Your order has been successfully created.
            Your order details have been securely retrieved
            from our database.
          </p>


          {/* Order ID */}

          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#faf7f2] p-5">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Order ID
            </p>


            <p className="mt-2 break-all text-xl font-bold tracking-wide">
              {order.orderId}
            </p>

          </div>

        </div>


        {/* ===================================================
            Order Details
        =================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">


          {/* =================================================
              Customer / Delivery Details
          ================================================= */}

          <div className="rounded-2xl border border-black/10 bg-white p-6">

            <h2 className="font-serif text-2xl font-bold">
              Delivery Details
            </h2>


            <div className="mt-6 space-y-3 text-sm">


              <p>

                <span className="font-semibold">
                  Name:
                </span>{" "}

                {order.customer.name}

              </p>


              <p>

                <span className="font-semibold">
                  Mobile:
                </span>{" "}

                {order.customer.phone}

              </p>


              <p>

                <span className="font-semibold">
                  Email:
                </span>{" "}

                {order.customer.email}

              </p>


              <div className="pt-2">

                <p className="font-semibold">
                  Address:
                </p>


                <p className="mt-1 leading-6 text-gray-600">

                  {order.customer.address}

                  <br />

                  {order.customer.city},{" "}
                  {order.customer.state}

                  <br />

                  PIN: {order.customer.pincode}

                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              Order Summary
          ================================================= */}

          <div className="rounded-2xl border border-black/10 bg-white p-6">

            <h2 className="font-serif text-2xl font-bold">
              Order Summary
            </h2>


            <div className="mt-6 space-y-4">


              {order.items.map((item, index) => (

                <div
                  key={`${item.productId}-${index}`}
                  className="border-b border-black/10 pb-4"
                >

                  <div className="flex items-start justify-between gap-4">


                    <div>

                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>


                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>


                    <p className="text-sm font-semibold">
                      {formatPrice(item.total)}
                    </p>

                  </div>

                </div>

              ))}

            </div>


            {/* =================================================
                Totals
            ================================================= */}

            <div className="mt-6 space-y-3 border-b border-black/10 pb-5">


              {/* Subtotal */}

              <div className="flex justify-between text-sm">

                <span className="text-gray-600">
                  Subtotal
                </span>


                <span className="font-semibold">
                  {formatPrice(order.subtotal)}
                </span>

              </div>


              {/* Shipping */}

              <div className="flex justify-between text-sm">

                <span className="text-gray-600">
                  Shipping
                </span>


                <span className="font-semibold">

                  {order.shipping === 0
                    ? "FREE"
                    : formatPrice(order.shipping)}

                </span>

              </div>

            </div>


            {/* Total */}

            <div className="mt-5 flex items-center justify-between">

              <span className="font-semibold">
                Total
              </span>


              <span className="text-2xl font-bold">
                {formatPrice(order.total)}
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            Order Status
        =================================================== */}

        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">

          <h2 className="font-serif text-xl font-bold">
            Order Status
          </h2>


          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


            <div>

              <p className="text-sm font-semibold">
                {order.status}
              </p>


              <p className="mt-1 text-xs text-gray-500">
                Payment status: {order.paymentStatus}
              </p>

            </div>


            <span
  className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold ${
    order.paymentStatus === "Paid"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800"
  }`}
>
  {order.paymentStatus === "Paid"
    ? "Payment Successful"
    : "Awaiting Payment"}
</span>

          </div>

        </div>


        {/* ===================================================
            Actions
        =================================================== */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">


          <Link
            href="/products"
            className="rounded-full bg-black px-8 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>


          <Link
            href="/cart"
            className="rounded-full border border-black/15 bg-white px-8 py-3 text-center text-sm font-semibold transition hover:border-black"
          >
            View Cart
          </Link>

        </div>

      </section>


      {/* =====================================================
          Footer
      ===================================================== */}

      <footer className="border-t border-black/10 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-gray-500">

          © {new Date().getFullYear()} BLR Seasonals.
          All rights reserved.

        </div>

      </footer>

    </main>

    );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">
          <p className="text-sm text-gray-500">
            Loading order...
          </p>
        </main>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}