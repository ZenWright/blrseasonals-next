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

  // =============================================================
  // Retry Payment
  // =============================================================

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
        mode: "production",
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

  // =============================================================
  // Verify Payment
  // =============================================================

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
         * Cashfree normally returns:
         *
         * ?order_id=BLR-XXXXXXXX
         *
         * We also support our own:
         *
         * ?orderId=BLR-XXXXXXXX
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
        // Verify payment with automatic retries
        // ---------------------------------------------------------

        const maxAttempts = 5;
        const retryDelay = 2000;

        for (
          let attempt = 1;
          attempt <= maxAttempts;
          attempt++
        ) {
          try {
            setStatus("checking");

            if (attempt === 1) {
              setMessage(
                "Verifying your payment with Cashfree..."
              );
            } else {
              setMessage(
                `Payment is still being processed. Checking again (${attempt}/${maxAttempts})...`
              );
            }

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  order_number:
                    currentOrderNumber,
                }),
              }
            );

            const data =
              await response.json();

            // -----------------------------------------------------
            // Backend error
            // -----------------------------------------------------

            if (!response.ok) {
              throw new Error(
                data.detail ||
                  "Unable to verify payment."
              );
            }

            // -----------------------------------------------------
            // Payment successful
            // -----------------------------------------------------

            if (
              data.success === true &&
              data.payment_status === "Paid"
            ) {
              setStatus("success");

              setMessage(
                "Payment verified successfully."
              );

              // Give the backend/database a moment
              // before loading the order confirmation page.
              setTimeout(() => {
                window.location.href =
                  `/order-confirmation?orderId=${encodeURIComponent(
                    currentOrderNumber
                  )}`;
              }, 1500);

              return;
            }

            // -----------------------------------------------------
            // Payment still pending
            // -----------------------------------------------------

            const paymentStatus =
              String(
                data.payment_status || ""
              ).toUpperCase();

            if (
              paymentStatus === "PENDING"
            ) {
              if (
                attempt < maxAttempts
              ) {
                await new Promise(
                  (resolve) =>
                    setTimeout(
                      resolve,
                      retryDelay
                    )
                );

                continue;
              }

              // All verification attempts
              // have been exhausted.
              setStatus("pending");

              setMessage(
                "Your payment is still being processed. Please wait a moment and check your order status."
              );

              return;
            }

            // -----------------------------------------------------
            // Payment failed / not completed
            // -----------------------------------------------------

            setStatus("failed");

            setMessage(
              data.message ||
                "Payment was not completed."
            );

            return;
          } catch (error) {
            console.error(
              `Payment verification attempt ${attempt} failed:`,
              error
            );

            // Retry temporary verification
            // failures as well.
            if (
              attempt < maxAttempts
            ) {
              await new Promise(
                (resolve) =>
                  setTimeout(
                    resolve,
                    retryDelay
                  )
              );

              continue;
            }

            throw error;
          }
        }
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
              {message}
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
            {(status === "pending" ||
              status === "error") && (
              <button
                onClick={retryPayment}
                className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Try Payment Again
              </button>
            )}

            <Link
              href="/checkout"
              className="rounded-xl border border-black/10 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
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