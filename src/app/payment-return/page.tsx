"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentState =
  | "checking"
  | "success"
  | "pending"
  | "failed"
  | "error";

export default function PaymentReturnPage() {
  const [status, setStatus] =
    useState<PaymentState>("checking");

  const [message, setMessage] =
    useState("Verifying your payment...");

  const [orderNumber, setOrderNumber] =
    useState("");
const retryPayment = async () => {
  if (!orderNumber) {
    return;
  }

  try {
    setStatus("checking");
    setMessage("Preparing your payment...");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payments/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_number: orderNumber,
          return_url:
            `${window.location.origin}/payment-return?orderId=${encodeURIComponent(
              orderNumber
            )}`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          "Unable to start payment."
      );
    }

    if (!data.payment_session_id) {
      throw new Error(
        "Payment session was not created."
      );
    }

    const { load } =
      await import(
        "@cashfreepayments/cashfree-js"
      );

    const cashfree = await load({
      mode: "sandbox",
    });

    if (!cashfree) {
      throw new Error(
        "Cashfree payment system could not be loaded."
      );
    }

    await cashfree.checkout({
      paymentSessionId:
        data.payment_session_id,
    });
  } catch (error) {
    console.error(
      "Retry payment failed:",
      error
    );

    setStatus("error");

    setMessage(
      error instanceof Error
        ? error.message
        : "Unable to restart payment."
    );
  }
};
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // ---------------------------------------------------------
        // Read order number from Cashfree return URL
        // ---------------------------------------------------------

        const params = new URLSearchParams(
          window.location.search
        );

        /*
         * Cashfree appends:
         *
         * ?order_id=BLR-XXXXXXXX
         *
         * We also keep support for our own orderId parameter.
         */

        const cashfreeOrderId =
          params.get("order_id");

        const ourOrderId =
          params.get("orderId");

        const currentOrderNumber =
          cashfreeOrderId || ourOrderId;

        if (!currentOrderNumber) {
          throw new Error(
            "Order number was not found."
          );
        }

        setOrderNumber(currentOrderNumber);

        // ---------------------------------------------------------
        // Ask FastAPI to verify the payment with Cashfree
        // ---------------------------------------------------------

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_number:
                currentOrderNumber,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              "Unable to verify payment."
          );
        }

        // ---------------------------------------------------------
        // Payment successful
        // ---------------------------------------------------------

        if (
          data.success === true &&
          data.payment_status === "Paid"
        ) {
          setStatus("success");
          setMessage(
            "Payment verified successfully."
          );

          // Give the customer a moment to see
          // the successful payment message.
          setTimeout(() => {
            window.location.href =
              `/order-confirmation?orderId=${encodeURIComponent(
                currentOrderNumber
              )}`;
          }, 1200);

          return;
        }

        // ---------------------------------------------------------
        // Payment still pending
        // ---------------------------------------------------------

        if (
          data.payment_status === "PENDING"
        ) {
          setStatus("pending");
          setMessage(
            "Your payment is still being processed. Please wait a moment and check your order status."
          );

          return;
        }

        // ---------------------------------------------------------
        // Payment failed / not completed
        // ---------------------------------------------------------

        setStatus("failed");
        setMessage(
          data.message ||
            "Payment was not completed."
        );
      } catch (error) {
        console.error(
          "Payment verification failed:",
          error
        );

        setStatus("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "We could not verify your payment."
        );
      }
    };

    verifyPayment();
  }, []);

  // =============================================================
  // Checking Payment
  // =============================================================

  if (status === "checking") {
    return (
      <main className="min-h-screen bg-[#faf7f2] text-gray-900">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-black/10 border-t-black" />

            <h1 className="mt-6 font-serif text-2xl font-bold">
              Verifying Payment
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Please wait while we securely verify
              your payment with Cashfree.
            </p>

            {orderNumber && (
              <p className="mt-5 text-xs text-gray-500">
                Order:{" "}
                <span className="font-semibold text-gray-900">
                  {orderNumber}
                </span>
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  // =============================================================
  // Successful Payment
  // =============================================================

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#faf7f2] text-gray-900">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>

            <h1 className="mt-6 font-serif text-3xl font-bold">
              Payment Successful
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {message}
            </p>

            {orderNumber && (
              <p className="mt-5 text-sm">
                Order Number:{" "}
                <span className="font-semibold">
                  {orderNumber}
                </span>
              </p>
            )}

            <p className="mt-6 text-xs text-gray-500">
              Redirecting to your order confirmation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =============================================================
  // Pending / Failed / Error
  // =============================================================

  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            !
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold">
            {status === "pending"
              ? "Payment Pending"
              : "Payment Not Completed"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {message}
          </p>

          {orderNumber && (
            <p className="mt-5 text-sm">
              Order Number:{" "}
              <span className="font-semibold">
                {orderNumber}
              </span>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Return to Checkout
            </Link>

            <Link
              href="/products"
              className="rounded-xl border border-black/10 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}