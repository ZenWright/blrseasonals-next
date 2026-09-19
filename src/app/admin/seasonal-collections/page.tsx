"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type SeasonalCollection = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
};

export default function AdminSeasonalCollectionsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  const [collections, setCollections] = useState<SeasonalCollection[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  // ---------------------------------------------------------
  // Firebase Admin Authentication
  // ---------------------------------------------------------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
        return;
      }

      try {
        const tokenResult = await currentUser.getIdTokenResult();

        if (tokenResult.claims.admin !== true) {
          router.replace("/admin/login");
          return;
        }

        setUser(currentUser);
      } catch (authError) {
        console.error("Admin authentication failed:", authError);
        router.replace("/admin/login");
      } finally {
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ---------------------------------------------------------
  // Get Firebase ID token
  // ---------------------------------------------------------

  async function getAdminToken() {
    if (!user) {
      throw new Error("Admin user is not authenticated.");
    }

    return await user.getIdToken(true);
  }

  // ---------------------------------------------------------
  // Load seasonal collections
  // ---------------------------------------------------------

  async function loadCollections() {
    try {
      setLoading(true);
      setError("");

      const token = await getAdminToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/seasonal-collections`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.detail || "Failed to load seasonal collections."
        );
      }

      const data = await response.json();

      setCollections(data);
    } catch (loadError) {
      console.error(loadError);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load seasonal collections."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadCollections();
    }
  }, [user]);

  // ---------------------------------------------------------
  // Add new collection
  // ---------------------------------------------------------

  async function handleAddCollection(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Collection name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = await getAdminToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/seasonal-collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
            start_date: startDate || null,
            end_date: endDate || null,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to create seasonal collection."
        );
      }

      setMessage("Seasonal collection created successfully.");

      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");

      await loadCollections();
    } catch (saveError) {
      console.error(saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to create seasonal collection."
      );
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------
  // Start editing
  // ---------------------------------------------------------

  function startEditing(collection: SeasonalCollection) {
    setEditingId(collection.id);

    setEditName(collection.name);
    setEditDescription(collection.description || "");
    setEditStartDate(collection.start_date || "");
    setEditEndDate(collection.end_date || "");
    setEditIsActive(collection.is_active);

    setMessage("");
    setError("");
  }

  // ---------------------------------------------------------
  // Cancel editing
  // ---------------------------------------------------------

  function cancelEditing() {
    setEditingId(null);

    setEditName("");
    setEditDescription("");
    setEditStartDate("");
    setEditEndDate("");
    setEditIsActive(true);
  }

  // ---------------------------------------------------------
  // Save collection edit
  // ---------------------------------------------------------

  async function handleSaveEdit(collectionId: number) {
    if (!editName.trim()) {
      setError("Collection name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = await getAdminToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/seasonal-collections/${collectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName.trim(),
            description: editDescription.trim() || null,
            is_active: editIsActive,
            start_date: editStartDate || null,
            end_date: editEndDate || null,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to update seasonal collection."
        );
      }

      setMessage("Seasonal collection updated successfully.");

      cancelEditing();

      await loadCollections();
    } catch (updateError) {
      console.error(updateError);

      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update seasonal collection."
      );
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------
  // Loading states
  // ---------------------------------------------------------

  if (loadingAuth) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Checking admin access...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // ---------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------

  const totalCollections = collections.length;

  const activeCollections = collections.filter(
    (collection) => collection.is_active
  ).length;

  const inactiveCollections = collections.filter(
    (collection) => !collection.is_active
  ).length;

  // ---------------------------------------------------------
  // Page
  // ---------------------------------------------------------

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
              BLR Seasonals
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-stone-900">
              Seasonal Collections
            </h1>

            <p className="mt-2 text-sm text-stone-600">
              Create and manage collections used across the store.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Total Collections</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">
              {totalCollections}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Active</p>
            <p className="mt-2 text-3xl font-semibold text-green-700">
              {activeCollections}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Inactive</p>
            <p className="mt-2 text-3xl font-semibold text-stone-600">
              {inactiveCollections}
            </p>
          </div>
        </div>

        {/* Add Collection */}
        <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-stone-900">
              Add Seasonal Collection
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Create a new collection for your seasonal campaigns.
            </p>
          </div>

          <form
            onSubmit={handleAddCollection}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Collection Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Diwali Special Collection"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Description
              </label>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short collection description"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add Collection"}
              </button>
            </div>
          </form>
        </section>

        {/* Collection List */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-stone-900">
              All Seasonal Collections
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Manage your existing seasonal collections.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-stone-500">
              Loading collections...
            </div>
          ) : collections.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-stone-500">
              No seasonal collections found.
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {collections.map((collection) => {
                const isEditing = editingId === collection.id;

                return (
                  <div key={collection.id} className="p-6">

                    {!isEditing ? (
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-stone-900">
                              {collection.name}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                collection.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {collection.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-stone-600">
                            {collection.description ||
                              "No description added."}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-stone-500">
                            <span>
                              Start:{" "}
                              {collection.start_date || "Not set"}
                            </span>

                            <span>
                              End:{" "}
                              {collection.end_date || "Not set"}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => startEditing(collection)}
                          className="shrink-0 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>
                          <label className="mb-2 block text-sm font-medium text-stone-700">
                            Collection Name
                          </label>

                          <input
                            type="text"
                            value={editName}
                            onChange={(event) =>
                              setEditName(event.target.value)
                            }
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-stone-700">
                            Description
                          </label>

                          <input
                            type="text"
                            value={editDescription}
                            onChange={(event) =>
                              setEditDescription(event.target.value)
                            }
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-stone-700">
                            Start Date
                          </label>

                          <input
                            type="date"
                            value={editStartDate}
                            onChange={(event) =>
                              setEditStartDate(event.target.value)
                            }
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-stone-700">
                            End Date
                          </label>

                          <input
                            type="date"
                            value={editEndDate}
                            onChange={(event) =>
                              setEditEndDate(event.target.value)
                            }
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-3 text-sm font-medium text-stone-700">
                            <input
                              type="checkbox"
                              checked={editIsActive}
                              onChange={(event) =>
                                setEditIsActive(event.target.checked)
                              }
                              className="h-4 w-4 rounded"
                            />

                            Collection is active
                          </label>
                        </div>

                        <div className="flex flex-wrap gap-3 md:col-span-2">
                          <button
                            onClick={() =>
                              handleSaveEdit(collection.id)
                            }
                            disabled={saving}
                            className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-60"
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>

                          <button
                            onClick={cancelEditing}
                            disabled={saving}
                            className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}