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

export default function AdminInventoryPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  const [editingStock, setEditingStock] = useState<
    Record<string, string>
  >({});

  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // Authentication + Load Products
  // =========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          router.replace("/admin/login");
          return;
        }

        try {
          const tokenResult = await user.getIdTokenResult();

          const isAdmin =
            tokenResult.claims.admin === true;

          if (!isAdmin) {
            router.replace("/admin/login");
            return;
          }

          setCheckingAuth(false);

          // -------------------------------------------------
          // Load products
          // -------------------------------------------------

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

          // -------------------------------------------------
          // Prepare editable inventory values
          // -------------------------------------------------

          const stockValues: Record<string, string> = {};

          data.forEach((product) => {
            stockValues[product.id] =
              String(product.inventory);
          });

          setEditingStock(stockValues);
        } catch (error) {
          console.error(
            "Inventory loading failed:",
            error
          );

          setError(
            "Unable to load inventory."
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
  // Update Stock
  // =========================================================

  async function handleSaveStock(product: Product) {
    setError("");
    setSuccess("");

    const value =
      editingStock[product.id];

    const newInventory = Number(value);

    // -------------------------------------------------------
    // Validate
    // -------------------------------------------------------

    if (
      value === "" ||
      !Number.isInteger(newInventory) ||
      newInventory < 0
    ) {
      setError(
        `Invalid stock value for "${product.name}".`
      );
      return;
    }

    // -------------------------------------------------------
    // No change
    // -------------------------------------------------------

    if (
      newInventory === product.inventory
    ) {
      setSuccess(
        `"${product.name}" already has ${newInventory} units.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);

      return;
    }

    try {
      setSavingId(product.id);

      const user = auth.currentUser;

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      // -----------------------------------------------------
      // Get fresh Firebase ID token
      // -----------------------------------------------------

      const token =
        await user.getIdToken(true);

      // -----------------------------------------------------
      // Protected inventory API
      // -----------------------------------------------------

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${product.id}/inventory`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            inventory: newInventory,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update inventory."
        );
      }

      // -----------------------------------------------------
      // Update product in local state
      // -----------------------------------------------------

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? {
                ...item,
                inventory: newInventory,
              }
            : item
        )
      );

      setEditingStock((current) => ({
        ...current,
        [product.id]:
          String(newInventory),
      }));

      setSuccess(
        `Stock updated for "${product.name}".`
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Inventory update failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update inventory."
      );
    } finally {
      setSavingId(null);
    }
  }

  // =========================================================
  // Loading
  // =========================================================

  if (checkingAuth || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">
        <div className="rounded-2xl border border-stone-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            Loading inventory...
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // Inventory Statistics
  // =========================================================

  const totalProducts =
    products.length;

  const healthyStock =
    products.filter(
      (product) => product.inventory > 5
    ).length;

  const lowStock =
    products.filter(
      (product) =>
        product.inventory > 0 &&
        product.inventory <= 5
    ).length;

  const outOfStock =
    products.filter(
      (product) => product.inventory === 0
    ).length;

  const totalUnits =
    products.reduce(
      (total, product) =>
        total + product.inventory,
      0
    );

  // =========================================================
  // Page
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/admin")
            }
            className="mb-5 text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            ← Back to Dashboard
          </button>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            BLR Seasonals
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">
            Inventory Management
          </h1>

          <p className="mt-2 text-stone-600">
            Manage live product stock directly
            from your admin dashboard.
          </p>
        </div>

        {/* =================================================
            Messages
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* =================================================
            Statistics
        ================================================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">
              Total Units
            </p>

            <p className="mt-2 text-3xl font-bold text-stone-900">
              {totalUnits}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <p className="text-sm text-green-700">
              Healthy Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {healthyStock}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm text-amber-700">
              Low Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-800">
              {lowStock}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <p className="text-sm text-red-700">
              Out of Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-red-800">
              {outOfStock}
            </p>
          </div>
        </div>

        {/* =================================================
            Product Table
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

          <div className="border-b border-stone-200 px-6 py-5">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Product Stock
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Change the stock quantity and save
              directly to MySQL.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-stone-50">
                <tr className="border-b border-stone-200 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">

                  <th className="px-5 py-4">
                    Product
                  </th>

                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Price
                  </th>

                  <th className="px-5 py-4">
                    Current Stock
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Update Stock
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">

                {products.map((product) => {

                  const isSaving =
                    savingId === product.id;

                  const stockValue =
                    editingStock[
                      product.id
                    ] ?? "";

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-stone-50"
                    >

                      {/* Product */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-4">

                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">

                            {product.images?.[0] ? (
                              <img
                                src={
                                  product.images[0]
                                }
                                alt={
                                  product.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                                No Image
                              </div>
                            )}

                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-stone-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-stone-400">
                              ID #{product.id}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Category */}

                      <td className="px-5 py-5">
                        <span className="text-sm text-stone-600">
                          {product.category ||
                            "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}

                      <td className="px-5 py-5">
                        <span className="font-medium text-stone-900">
                          ₹
                          {product.price.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </td>

                      {/* Current Stock */}

                      <td className="px-5 py-5">

                        <span className="font-semibold text-stone-900">
                          {product.inventory}
                        </span>

                        <span className="ml-1 text-sm text-stone-500">
                          units
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-5">

                        {product.inventory ===
                        0 ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Out of Stock
                          </span>
                        ) : product.inventory <=
                          5 ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Healthy
                          </span>
                        )}

                      </td>

                      {/* Update Stock */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-2">

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={stockValue}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditingStock(
                                (current) => ({
                                  ...current,
                                  [product.id]:
                                    event.target
                                      .value,
                                })
                              )
                            }
                            className="w-24 rounded-lg border border-stone-300 bg-white px-3 py-2 text-center text-sm font-medium text-stone-900 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900 disabled:bg-stone-100"
                          />

                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() =>
                              handleSaveStock(
                                product
                              )
                            }
                            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSaving
                              ? "Saving..."
                              : "Save"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  );
}