"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type OrderItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type Order = {
  order_id: string;

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
  payment_status: string;

  created_at: string | null;
};

const ORDER_STATUSES = [
  "Pending Payment",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const orderNumber =
    params.order_number as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [status, setStatus] =
    useState("");

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [savingStatus, setSavingStatus] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            router.replace(
              "/admin/login"
            );
            return;
          }

          try {
            const tokenResult =
              await user.getIdTokenResult(
                true
              );

            if (
              tokenResult.claims.admin !==
              true
            ) {
              router.replace(
                "/admin/login"
              );
              return;
            }

            setCheckingAuth(false);

            const token =
              await user.getIdToken();

            const response =
              await fetch(
                `http://127.0.0.1:8000/orders/${encodeURIComponent(
                  orderNumber
                )}`,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                  cache: "no-store",
                }
              );

            const data =
              await response.json();

            if (!response.ok) {
              throw new Error(
                data.detail ||
                  "Failed to load order."
              );
            }

            if (!data.order) {
              throw new Error(
                "Order data was not returned by the server."
              );
            }

            setOrder(data.order);
            setStatus(
              data.order.status ||
                "Pending Payment"
            );
          } catch (error) {
            console.error(
              "Order details loading failed:",
              error
            );

            setError(
              error instanceof Error
                ? error.message
                : "Unable to load order."
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, [
    router,
    orderNumber,
  ]);

  function formatDate(
    dateString: string | null
  ) {
    if (!dateString) {
      return "—";
    }

    return new Date(
      dateString
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function formatMoney(
    amount: number | null | undefined
  ) {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  }

  function getStatusClass(
    currentStatus: string
  ) {
    const value =
      currentStatus?.toLowerCase();

    if (
      value === "delivered" ||
      value === "completed"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      value === "shipped" ||
      value === "processing"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-amber-100 text-amber-700";
  }

  async function handleStatusSave() {
    if (!order) {
      return;
    }

    setSavingStatus(true);
    setError("");
    setSuccess("");

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "Admin session expired. Please log in again."
        );
      }

      const token =
        await user.getIdToken(true);

      const response =
        await fetch(
          `http://127.0.0.1:8000/admin/orders/${encodeURIComponent(
            order.order_id
          )}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update order status."
        );
      }

      setOrder((currentOrder) =>
        currentOrder
          ? {
              ...currentOrder,
              status:
                data.new_status ||
                status,
            }
          : currentOrder
      );

      setStatus(
        data.new_status ||
          status
      );

      setSuccess(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(
        "Order status update failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );
    } finally {
      setSavingStatus(false);
    }
  }

  if (
    checkingAuth ||
    loading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">
        <div className="rounded-2xl border border-stone-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            {checkingAuth
              ? "Verifying admin access..."
              : "Loading order..."}
          </p>
        </div>
      </main>
    );
  }

  if (
    error &&
    !order
  ) {
    return (
      <main className="min-h-screen bg-[#f7f3ee] px-6 py-10">
        <div className="mx-auto max-w-4xl">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/orders"
              )
            }
            className="mb-6 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            ← Back to Orders
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-800">
              Order Not Found
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>
          </div>

        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-6 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/orders"
              )
            }
            className="mb-6 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            ← Back to Orders
          </button>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            BLR Seasonals
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h1 className="font-serif text-4xl font-bold text-stone-900">
                Order Details
              </h1>

              <p className="mt-2 text-stone-600">
                {order.order_id}
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status ||
                  "Pending Payment"}
              </span>

              <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
                {order.payment_status ||
                  "Pending"}
              </span>

            </div>

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Customer + Order Information */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Customer */}

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-stone-900">
              Customer Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Name
                </p>

                <p className="mt-1 font-medium text-stone-900">
                  {order.customer.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Mobile
                </p>

                <p className="mt-1 text-stone-700">
                  {order.customer.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Email
                </p>

                <p className="mt-1 break-all text-stone-700">
                  {order.customer.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Delivery Address
                </p>

                <p className="mt-1 leading-6 text-stone-700">
                  {order.customer.address}
                  <br />
                  {order.customer.city},{" "}
                  {order.customer.state}
                  <br />
                  PIN:{" "}
                  {order.customer.pincode}
                </p>
              </div>

            </div>

          </section>

          {/* Order Information */}

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-stone-900">
              Order Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Order Number
                </p>

                <p className="mt-1 font-semibold text-stone-900">
                  {order.order_id}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Order Date
                </p>

                <p className="mt-1 text-stone-700">
                  {formatDate(
                    order.created_at
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Payment Status
                </p>

                <p className="mt-1 font-medium text-stone-700">
                  {order.payment_status ||
                    "Pending"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Order Status
                </p>

                <p className="mt-1 font-medium text-stone-700">
                  {order.status ||
                    "Pending Payment"}
                </p>
              </div>

            </div>

          </section>

        </div>

        {/* Products Ordered */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

          <div className="border-b border-stone-200 px-6 py-5">

            <h2 className="text-lg font-semibold text-stone-900">
              Products Ordered
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Items included in this order.
            </p>

          </div>

          {order.items &&
          order.items.length > 0 ? (
            <div className="divide-y divide-stone-100">

              {order.items.map(
                (item, index) => (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <h3 className="font-semibold text-stone-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-stone-500">
                        Product ID:{" "}
                        {item.product_id}
                      </p>

                      <p className="mt-1 text-sm text-stone-500">
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="font-semibold text-stone-900">
                        {formatMoney(
                          item.total
                        )}
                      </p>

                      <p className="mt-1 text-sm text-stone-500">
                        {formatMoney(
                          item.price
                        )}{" "}
                        ×{" "}
                        {item.quantity}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-stone-500">
              No products were found
              for this order.
            </div>
          )}

        </section>

        {/* Order Summary */}

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

          <div className="ml-auto max-w-md">

            <h2 className="mb-5 text-lg font-semibold text-stone-900">
              Order Summary
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between text-stone-600">
                <span>
                  Subtotal
                </span>

                <span>
                  {formatMoney(
                    order.subtotal
                  )}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>
                  Shipping
                </span>

                <span>
                  {formatMoney(
                    order.shipping
                  )}
                </span>
              </div>

              <div className="my-4 border-t border-stone-200" />

              <div className="flex justify-between text-xl font-bold text-stone-900">

                <span>
                  Total
                </span>

                <span>
                  {formatMoney(
                    order.total
                  )}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            Order Status Management
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-stone-900">
                Update Order Status
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Change the order status from the
                admin panel.
              </p>

            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                disabled={savingStatus}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-stone-500 sm:min-w-[220px]"
              >

                {ORDER_STATUSES.map(
                  (orderStatus) => (
                    <option
                      key={orderStatus}
                      value={orderStatus}
                    >
                      {orderStatus}
                    </option>
                  )
                )}

              </select>

              <button
                type="button"
                onClick={
                  handleStatusSave
                }
                disabled={
                  savingStatus
                }
                className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingStatus
                  ? "Saving..."
                  : "Save Status"}
              </button>

            </div>

          </div>

          <div className="mt-5 border-t border-stone-200 pt-5">

            <p className="text-sm text-stone-500">
              Current status:
            </p>

            <span
              className={`mt-2 inline-block rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                order.status
              )}`}
            >
              {order.status ||
                "Pending Payment"}
            </span>

          </div>

        </section>

      </div>

    </main>
  );
}