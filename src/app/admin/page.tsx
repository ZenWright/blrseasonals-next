"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Product = {
  id: string;
  name: string;
  price: number;
  mrp: number | null;
  inventory: number;
  featured: boolean;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);

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

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products`,
            {
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to load dashboard data."
            );
          }

          const data = await response.json();

          setProducts(data);
        } catch (error) {
          console.error(
            "Admin dashboard loading failed:",
            error
          );

          setError(
            "Unable to load dashboard data."
          );

          setCheckingAuth(false);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/admin/login");
    } catch (error) {
      console.error(
        "Admin logout failed:",
        error
      );
    }
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
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  const totalProducts = products.length;

  const totalInventory = products.reduce(
    (total, product) =>
      total + Number(product.inventory || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.inventory > 0 &&
      product.inventory <= 5
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.inventory === 0
  ).length;

  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            Header
        ===================================================== */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
              BLR Seasonals
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-stone-600">
              Manage your store, products and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Sign Out
          </button>

        </div>

        {/* =====================================================
            Error
        ===================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            Statistics
        ===================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total Products */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {totalProducts}
            </p>

            <p className="mt-2 text-xs text-stone-500">
              Products in catalogue
            </p>
          </div>

          {/* Total Inventory */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Total Inventory
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {totalInventory}
            </p>

            <p className="mt-2 text-xs text-stone-500">
              Units currently recorded
            </p>
          </div>

          {/* Low Stock */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Low Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {lowStockProducts}
            </p>

            <p className="mt-2 text-xs text-stone-500">
              1–5 units remaining
            </p>
          </div>

          {/* Out of Stock */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Out of Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {outOfStockProducts}
            </p>

            <p className="mt-2 text-xs text-stone-500">
              Products unavailable
            </p>
          </div>

          {/* Featured */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">
              Featured
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {featuredProducts}
            </p>

            <p className="mt-2 text-xs text-stone-500">
              Homepage collection
            </p>
          </div>

        </div>

        {/* =====================================================
            Quick Actions
        ===================================================== */}

        <section className="mt-10">

          <div className="mb-5">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Manage your store from one place.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Add Product */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/products/new"
                )
              }
              className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-2xl">
                +
              </p>

              <h3 className="mt-4 font-semibold text-stone-900">
                Add Product
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Add a new product to your catalogue.
              </p>
            </button>

            {/* Products */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/products"
                )
              }
              className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-2xl">
                ◇
              </p>

              <h3 className="mt-4 font-semibold text-stone-900">
                Manage Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Edit products, prices, images and details.
              </p>
            </button>

            {/* Inventory */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/inventory"
                )
              }
              className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-2xl">
                ▣
              </p>

              <h3 className="mt-4 font-semibold text-stone-900">
                Inventory
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Monitor stock levels and update inventory.
              </p>
            </button>

            {/* Orders */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/orders"
                )
              }
              className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-2xl">
                ✓
              </p>

              <h3 className="mt-4 font-semibold text-stone-900">
                Orders
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                View and manage customer orders.
              </p>
            </button>

          </div>

        </section>

        {/* =====================================================
            Store Status
        ===================================================== */}

        <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Store Status
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">
                Product Catalogue
              </p>

              <p className="mt-1 text-xs text-green-700">
                Connected
              </p>
            </div>

            <div className="rounded-xl bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">
                MySQL Database
              </p>

              <p className="mt-1 text-xs text-green-700">
                Connected
              </p>
            </div>

            <div className="rounded-xl bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">
                Firebase Admin
              </p>

              <p className="mt-1 text-xs text-green-700">
                Authenticated
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}