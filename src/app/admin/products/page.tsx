"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  mrp: number | null;
  inventory: number;
  images: string[];
  category: string | null;
  featured: boolean;
  seasonal_collections: string[];
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
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
          // Get Firebase token information.
          // This also checks the latest custom claims.
          const tokenResult = await user.getIdTokenResult();

          const isAdmin = tokenResult.claims.admin === true;

          if (!isAdmin) {
            console.error("Admin claim not found.");
            router.replace("/admin/login");
            return;
          }

          console.log(
            "Admin access confirmed:",
            user.email
          );

          setCheckingAuth(false);

          // =====================================================
          // Load Products
          // =====================================================

          setLoading(true);
          setError("");

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products`,
            {
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to load products."
            );
          }

          const data: Product[] =
            await response.json();

          setProducts(data);

        } catch (error) {
          console.error(
            "Admin authentication/product loading failed:",
            error
          );

          setError(
            "Unable to load admin products."
          );

          setCheckingAuth(false);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  // =========================================================
  // Authentication Loading
  // =========================================================

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

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            Header
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
      BLR Seasonals
    </p>

    <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">
      Products
    </h1>

    <p className="mt-2 text-stone-600">
      Manage your product catalogue from the admin dashboard.
    </p>
  </div>

  <button
    type="button"
    onClick={() => router.push("/admin/products/new")}
    className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
  >
    + Add Product
  </button>
</div>

        {/* =====================================================
            Summary
        ===================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">
              In Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {products.filter(
                (product) => product.inventory > 0
              ).length}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">
              Out of Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {products.filter(
                (product) => product.inventory === 0
              ).length}
            </p>
          </div>

        </div>

        {/* =====================================================
            Error
        ===================================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            Loading
        ===================================================== */}

        {loading && (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <p className="text-stone-600">
              Loading products...
            </p>
          </div>
        )}

        {/* =====================================================
            Products Table
        ===================================================== */}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="min-w-full text-left">

                <thead className="border-b border-stone-200 bg-stone-50">

                  <tr>

                    <th className="px-5 py-4 text-sm font-semibold text-stone-700">
                      Product
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-stone-700">
  Category
</th>

<th className="px-5 py-4 text-sm font-semibold text-stone-700">
  Seasonal Collections
</th>

<th className="px-5 py-4 text-sm font-semibold text-stone-700">
  Price
</th>

                    <th className="px-5 py-4 text-sm font-semibold text-stone-700">
                      MRP
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-stone-700">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-stone-700">
                      Featured
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-stone-700">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-stone-100">

                  {products.map((product) => (

                    <tr
                      key={product.id}
                      className="transition hover:bg-stone-50"
                    >

                      {/* Product */}

<td className="px-5 py-4">
  <div className="flex min-w-[280px] items-center gap-4">

    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">

      <div className="absolute inset-0 flex items-center justify-center text-center text-[10px] font-medium text-stone-400">
        No image
      </div>

      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="relative h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

    </div>

    <div className="min-w-0">

      <p className="font-semibold text-stone-900">
        {product.name}
      </p>

      <p className="mt-1 text-xs text-stone-500">
        ID: {product.id}
      </p>

    </div>

  </div>
</td>

                      {/* Category */}

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                          {product.category ?? "Uncategorized"}
                        </span>

                      </td>
                      <td className="px-5 py-4">
  <div className="flex flex-wrap gap-2">
    {product.seasonal_collections?.length > 0 ? (
      product.seasonal_collections.map((collection) => (
        <span
          key={collection}
          className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
        >
          {collection}
        </span>
      ))
    ) : (
      <span className="text-sm text-stone-400">
        —
      </span>
    )}
  </div>
</td>

                      {/* Price */}

                      <td className="px-5 py-4 font-semibold text-stone-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      {/* MRP */}

                      <td className="px-5 py-4 text-stone-600">
                        {product.mrp
                          ? `₹${product.mrp.toLocaleString("en-IN")}`
                          : "—"}
                      </td>

                      {/* Inventory */}

                      <td className="px-5 py-4">

                        {product.inventory === 0 ? (

                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Out of Stock
                          </span>

                        ) : product.inventory <= 5 ? (

                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Low Stock ({product.inventory})
                          </span>

                        ) : (

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            {product.inventory} in stock
                          </span>

                        )}

                      </td>

                      {/* Featured */}

                      <td className="px-5 py-4">

                        {product.featured ? (

                          <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
                            Featured
                          </span>

                        ) : (

                          <span className="text-sm text-stone-400">
                            No
                          </span>

                        )}

                      </td>

                      {/* Actions */}

<td className="px-5 py-4">

  <div className="flex items-center gap-2">

    <button
      type="button"
      onClick={() =>
        router.push(`/admin/products/${product.id}`)
      }
      className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-900 hover:text-white"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={async () => {
        const confirmed = window.confirm(
          `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
          return;
        }

        try {
          const user = auth.currentUser;

          if (!user) {
            alert("Admin session expired. Please login again.");
            router.replace("/admin/login");
            return;
          }

          const token = await user.getIdToken();

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${product.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.detail || "Failed to delete product."
            );
          }

          setProducts((currentProducts) =>
            currentProducts.filter(
              (item) => item.id !== product.id
            )
          );

          alert("Product deleted successfully.");
        } catch (error) {
          console.error("Product deletion failed:", error);

          alert(
            error instanceof Error
              ? error.message
              : "Failed to delete product."
          );
        }
      }}
      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
    >
      Delete
    </button>

  </div>

</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* =====================================================
            Empty
        ===================================================== */}

        {!loading &&
          !error &&
          products.length === 0 && (

            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-10 text-center">

              <p className="text-stone-600">
                No products found.
              </p>

            </div>

          )}

      </div>
    </main>
  );
}