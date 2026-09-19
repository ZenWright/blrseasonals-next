"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Category = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export default function AdminCategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  async function getAdminToken() {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/admin/login");
      throw new Error("You are not logged in.");
    }

    const tokenResult = await user.getIdTokenResult(true);

    if (tokenResult.claims.admin !== true) {
      router.replace("/");
      throw new Error("Admin access required.");
    }

    return await user.getIdToken(true);
  }

  async function loadCategories(token: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.detail || "Failed to load categories."
      );
    }

    setCategories(data);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult(true);

        if (tokenResult.claims.admin !== true) {
          router.replace("/");
          return;
        }

        const token = await user.getIdToken(true);

        await loadCategories(token);
      } catch (err) {
        console.error("Categories loading error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load categories."
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleCreateCategory(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setActionError("");

    const name = categoryName.trim();
    const description = categoryDescription.trim();

    if (!name) {
      setActionError("Category name is required.");
      return;
    }

    try {
      setCreating(true);

      const token = await getAdminToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description: description || null,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to create category."
        );
      }

      setCategoryName("");
      setCategoryDescription("");
      setMessage("Category created successfully.");
      setShowCreateForm(false);

      await loadCategories(token);
    } catch (err) {
      console.error("Category creation error:", err);

      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to create category."
      );
    } finally {
      setCreating(false);
    }
  }

  function startEditing(category: Category) {
    setMessage("");
    setActionError("");

    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
    setEditActive(category.is_active);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditActive(true);
  }

  async function handleSaveCategory() {
    if (editingId === null) {
      return;
    }

    setMessage("");
    setActionError("");

    const name = editName.trim();
    const description = editDescription.trim();

    if (!name) {
      setActionError("Category name is required.");
      return;
    }

    try {
      setSavingEdit(true);

      const token = await getAdminToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description: description || null,
            is_active: editActive,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to update category."
        );
      }

      setMessage("Category updated successfully.");

      cancelEditing();

      await loadCategories(token);
    } catch (err) {
      console.error("Category update error:", err);

      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to update category."
      );
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
              BLR Seasonals
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-stone-900">
              Categories
            </h1>

            <p className="mt-2 text-sm text-stone-600">
              Manage your product categories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setMessage("");
                setActionError("");
              }}
              className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              {showCreateForm
                ? "Close Form"
                : "+ Add Category"}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {actionError}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-stone-900">
                Add New Category
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Create a category for your product catalogue.
              </p>
            </div>

            <form
              onSubmit={handleCreateCategory}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(event) =>
                    setCategoryName(event.target.value)
                  }
                  placeholder="e.g. Wooden Furniture"
                  disabled={creating}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-600 focus:ring-2 focus:ring-stone-200"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  value={categoryDescription}
                  onChange={(event) =>
                    setCategoryDescription(event.target.value)
                  }
                  placeholder="Short description for this category"
                  rows={3}
                  disabled={creating}
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-600 focus:ring-2 focus:ring-stone-200"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <p className="text-sm text-stone-500">
              Loading categories...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-medium text-red-700">
              Unable to load categories
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500">
                  Total Categories
                </p>

                <p className="mt-2 text-3xl font-semibold text-stone-900">
                  {categories.length}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500">
                  Active
                </p>

                <p className="mt-2 text-3xl font-semibold text-stone-900">
                  {
                    categories.filter(
                      (category) => category.is_active
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500">
                  Inactive
                </p>

                <p className="mt-2 text-3xl font-semibold text-stone-900">
                  {
                    categories.filter(
                      (category) => !category.is_active
                    ).length
                  }
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="border-b border-stone-200 bg-stone-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        ID
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Description
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="transition hover:bg-stone-50"
                      >
                        <td className="px-6 py-5 text-sm font-medium text-stone-500">
                          #{category.id}
                        </td>

                        <td className="px-6 py-5">
                          {editingId === category.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(event) =>
                                setEditName(event.target.value)
                              }
                              disabled={savingEdit}
                              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-200"
                            />
                          ) : (
                            <p className="font-semibold text-stone-900">
                              {category.name}
                            </p>
                          )}
                        </td>

                        <td className="max-w-md px-6 py-5">
                          {editingId === category.id ? (
                            <textarea
                              value={editDescription}
                              onChange={(event) =>
                                setEditDescription(
                                  event.target.value
                                )
                              }
                              rows={2}
                              disabled={savingEdit}
                              className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-200"
                            />
                          ) : (
                            <p className="text-sm text-stone-600">
                              {category.description || "—"}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {editingId === category.id ? (
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editActive}
                                onChange={(event) =>
                                  setEditActive(
                                    event.target.checked
                                  )
                                }
                                disabled={savingEdit}
                                className="h-4 w-4 rounded border-stone-300"
                              />

                              <span className="text-sm font-medium text-stone-700">
                                Active
                              </span>
                            </label>
                          ) : (
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                category.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-stone-200 text-stone-600"
                              }`}
                            >
                              {category.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm text-stone-500">
                          {category.created_at
                            ? new Date(
                                category.created_at
                              ).toLocaleDateString("en-IN")
                            : "—"}
                        </td>

                        <td className="px-6 py-5">
                          {editingId === category.id ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={cancelEditing}
                                disabled={savingEdit}
                                className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
                              >
                                Cancel
                              </button>

                              <button
                                onClick={handleSaveCategory}
                                disabled={savingEdit}
                                className="rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
                              >
                                {savingEdit
                                  ? "Saving..."
                                  : "Save"}
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  startEditing(category)
                                }
                                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {categories.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-sm text-stone-500"
                        >
                          No categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}