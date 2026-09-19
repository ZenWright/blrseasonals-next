"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_status: string;
  payment_gateway: string | null;
  payment_id: string | null;
  item_count: number;
  created_at: string | null;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          router.replace("/admin/login");
          return;
        }

        try {
          const tokenResult =
            await user.getIdTokenResult(true);

          if (tokenResult.claims.admin !== true) {
            router.replace("/admin/login");
            return;
          }

          setCheckingAuth(false);
          setLoading(true);
          setError("");

          const token = await user.getIdToken();

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.detail ||
                "Failed to load orders."
            );
          }

          setOrders(data.orders || []);
        } catch (error) {
          console.error(
            "Admin orders loading failed:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load orders."
          );

          setCheckingAuth(false);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

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

  function getStatusClass(status: string) {
    const value = status.toLowerCase();

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

  function getPaymentClass(
    paymentStatus: string
  ) {
    const value =
      paymentStatus.toLowerCase();

    if (
      value === "paid" ||
      value === "completed" ||
      value === "success"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      value === "failed" ||
      value === "cancelled"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-stone-100 text-stone-700";
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">
        <div className="rounded-2xl border border-stone-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            Verifying admin access...
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">
        <div className="rounded-2xl border border-stone-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            Loading orders...
          </p>
        </div>
      </main>
    );
  }

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => {
      const status =
        order.payment_status?.toLowerCase();

      return (
        status === "paid" ||
        status === "completed" ||
        status === "success"
      );
    }
  ).length;

  const pendingOrders = orders.filter(
    (order) => {
      const status =
        order.status?.toLowerCase();

      return (
        status !== "delivered" &&
        status !== "completed" &&
        status !== "cancelled" &&
        status !== "canceled"
      );
    }
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
              BLR Seasonals
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">
              Orders
            </h1>

            <p className="mt-2 text-stone-600">
              View and manage customer orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/admin")
            }
            className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            ← Dashboard
          </button>

        </div>

        {/* Summary */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Pending Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Paid Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {paidOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Total Revenue
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Orders Table */}

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

          <div className="border-b border-stone-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-stone-900">
              Customer Orders
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Orders are loaded directly from your
              database.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-serif text-2xl font-bold text-stone-900">
                No orders yet
              </p>

              <p className="mt-2 text-sm text-stone-500">
                Customer orders will appear here
                when they are placed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] text-left">

                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Items
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">

                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-stone-50"
                    >

                      {/* Order */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-stone-900">
                          {order.order_number}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          Order ID: {order.id}
                        </p>

                      </td>

                      {/* Customer */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-stone-900">
                          {order.customer_name}
                        </p>

                        <p className="mt-1 text-sm text-stone-500">
                          {order.mobile}
                        </p>

                        <p className="text-xs text-stone-400">
                          {order.email}
                        </p>

                      </td>

                      {/* Items */}

                      <td className="px-6 py-5">

                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                          {order.item_count}{" "}
                          {order.item_count === 1
                            ? "item"
                            : "items"}
                        </span>

                      </td>

                      {/* Total */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-stone-900">
                          ₹
                          {Number(
                            order.total
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p className="mt-1 text-xs text-stone-400">
                          Shipping: ₹
                          {Number(
                            order.shipping || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </td>

                      {/* Payment */}

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status ||
                            "Pending"}
                        </span>

                        {order.payment_gateway && (
                          <p className="mt-2 text-xs text-stone-400">
                            {
                              order.payment_gateway
                            }
                          </p>
                        )}

                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Pending"}
                        </span>

                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">

                        <p className="text-sm text-stone-700">
                          {formatDate(
                            order.created_at
                          )}
                        </p>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}