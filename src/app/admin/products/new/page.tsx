"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Category = {
  id: number;
  name: string;
};

type SeasonalCollection = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
};

export default function NewProductPage() {
  const router = useRouter();

  // -------------------------------------------------------
  // Authentication
  // -------------------------------------------------------

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // -------------------------------------------------------
  // Product
  // -------------------------------------------------------

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [inventory, setInventory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);

  // -------------------------------------------------------
  // Images
  // -------------------------------------------------------

  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState("");

  // -------------------------------------------------------
  // Seasonal Collections
  // -------------------------------------------------------

  const [seasonalCollections, setSeasonalCollections] =
    useState<SeasonalCollection[]>([]);

  const [selectedSeasonalCollections, setSelectedSeasonalCollections] =
    useState<number[]>([]);

  const [seasonalCollectionsLoading, setSeasonalCollectionsLoading] =
    useState(false);

  // -------------------------------------------------------
  // Saving / Messages
  // -------------------------------------------------------

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -------------------------------------------------------
  // Admin authentication
  // -------------------------------------------------------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult(true);

        if (tokenResult.claims.admin !== true) {
          router.replace("/admin");
          return;
        }

        setAuthorized(true);
      } catch (authError) {
        console.error("Admin authorization failed:", authError);
        router.replace("/admin/login");
      } finally {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // -------------------------------------------------------
  // Load categories
  // -------------------------------------------------------

  useEffect(() => {
    if (!authorized) {
      return;
    }

    async function loadCategories() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to load categories.");
        }

        const data = await response.json();

        setCategories(Array.isArray(data) ? data : []);
      } catch (loadError) {
        console.error(
          "Failed to load categories:",
          loadError
        );

        setError(
          "Could not load categories. Please refresh the page."
        );
      }
    }

    loadCategories();
  }, [authorized]);

  // -------------------------------------------------------
  // Load seasonal collections
  // -------------------------------------------------------

  useEffect(() => {
    if (!authorized) {
      return;
    }

    async function loadSeasonalCollections() {
      setSeasonalCollectionsLoading(true);

      try {
        const user = auth.currentUser;

        if (!user) {
          router.replace("/admin/login");
          return;
        }

        const token = await user.getIdToken(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/seasonal-collections`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(
            data?.detail ||
              "Failed to load seasonal collections."
          );
        }

        const data = await response.json();

        const activeCollections = Array.isArray(data)
          ? data.filter(
              (collection: SeasonalCollection) =>
                collection.is_active
            )
          : [];

        setSeasonalCollections(activeCollections);
      } catch (loadError) {
        console.error(
          "Failed to load seasonal collections:",
          loadError
        );

        setError(
          "Could not load seasonal collections."
        );
      } finally {
        setSeasonalCollectionsLoading(false);
      }
    }

    loadSeasonalCollections();
  }, [authorized, router]);

  // -------------------------------------------------------
  // Add image
  // -------------------------------------------------------

  function handleAddImage() {
    const imageName = newImage.trim();

    if (!imageName) {
      return;
    }

    if (
      imageName.includes("/") ||
      imageName.includes("\\")
    ) {
      setError(
        "Enter the image filename only, for example: clock.png"
      );
      return;
    }

    if (images.includes(imageName)) {
      setError("This image is already added.");
      return;
    }

    setImages((currentImages) => [
      ...currentImages,
      imageName,
    ]);

    setNewImage("");
    setError("");
  }

  // -------------------------------------------------------
  // Remove image
  // -------------------------------------------------------

  function handleRemoveImage(imageName: string) {
    setImages((currentImages) =>
      currentImages.filter(
        (image) => image !== imageName
      )
    );

    setError("");
  }

  // -------------------------------------------------------
  // Create product
  // -------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------------------------------
    // Frontend validation
    // -----------------------------------------------------

    if (!title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!price || Number(price) < 0) {
      setError("Please enter a valid selling price.");
      return;
    }

    if (mrp && Number(mrp) < 0) {
      setError("MRP cannot be negative.");
      return;
    }

    if (!inventory || Number(inventory) < 0) {
      setError("Please enter valid inventory.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (images.length === 0) {
      setError(
        "Please add at least one product image."
      );
      return;
    }

    try {
      setSaving(true);

      const user = auth.currentUser;

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const token = await user.getIdToken(true);

      // ---------------------------------------------------
      // Create product
      // ---------------------------------------------------

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            price: Number(price),
            mrp: mrp ? Number(mrp) : null,
            inventory: Number(inventory),
            category_id: Number(categoryId),
            featured,
            images,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to create product."
        );
      }

      // ---------------------------------------------------
      // Save seasonal collections
      // ---------------------------------------------------

      const productId = data.product_id;

      if (
        Array.isArray(selectedSeasonalCollections)
      ) {
        const seasonalResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${productId}/seasonal-collections`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              collection_ids:
                selectedSeasonalCollections,
            }),
          }
        );

        if (!seasonalResponse.ok) {
          const seasonalData =
            await seasonalResponse
              .json()
              .catch(() => null);

          throw new Error(
            seasonalData?.detail ||
              "Product created, but seasonal collections could not be saved."
          );
        }
      }

      setSuccess(
        `Product created successfully. Product ID: ${productId}`
      );

      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (createError) {
      console.error(
        "Product creation failed:",
        createError
      );

      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create product."
      );
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------------------------
  // Loading screen
  // -------------------------------------------------------

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">
        <p className="text-sm text-stone-500">
          Checking admin access...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  // -------------------------------------------------------
  // Page
  // -------------------------------------------------------

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        <button
          type="button"
          onClick={() =>
            router.push("/admin/products")
          }
          className="mb-8 text-sm text-stone-600 transition hover:text-stone-900"
        >
          ← Back to Products
        </button>

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            BLR Seasonals
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold text-stone-900">
            Add Product
          </h1>

          <p className="mt-2 text-stone-600">
            Create a new product for your catalogue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
        >

          {/* -------------------------------------------------
              Product Information
          ------------------------------------------------- */}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-stone-900">
              Product Information
            </h2>

            <div className="mt-5 space-y-6">

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  Product Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter product title"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={5}
                  placeholder="Describe the product"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-900"
                />
              </div>

            </div>
          </div>

          {/* -------------------------------------------------
              Pricing & Inventory
          ------------------------------------------------- */}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-stone-900">
              Pricing & Inventory
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  Selling Price (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  MRP (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  value={mrp}
                  onChange={(event) =>
                    setMrp(event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  Inventory
                </label>

                <input
                  type="number"
                  min="0"
                  value={inventory}
                  onChange={(event) =>
                    setInventory(event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-900"
                />
              </div>

            </div>
          </div>

          {/* -------------------------------------------------
              Category
          ------------------------------------------------- */}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-stone-900">
              Category
            </h2>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-stone-800">
                Product Category
              </label>

              <select
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
              >
                <option value="">
                  Select a category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* -------------------------------------------------
              Seasonal Collections
          ------------------------------------------------- */}

          <div className="mb-8 rounded-xl border border-stone-200 p-5">

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-stone-900">
                Seasonal Collections
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Select the seasonal collections where
                this product should appear.
              </p>
            </div>

            {seasonalCollectionsLoading ? (
              <p className="text-sm text-stone-500">
                Loading seasonal collections...
              </p>
            ) : seasonalCollections.length === 0 ? (
              <p className="text-sm text-stone-500">
                No active seasonal collections available.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-3">

                {seasonalCollections.map(
                  (collection) => {
                    const isSelected =
                      selectedSeasonalCollections.includes(
                        collection.id
                      );

                    return (
                      <label
                        key={collection.id}
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          isSelected
                            ? "border-black bg-stone-50"
                            : "border-stone-200 bg-white hover:border-stone-400"
                        }`}
                      >
                        <div className="flex items-start gap-3">

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedSeasonalCollections(
                                (current) =>
                                  current.includes(
                                    collection.id
                                  )
                                    ? current.filter(
                                        (id) =>
                                          id !==
                                          collection.id
                                      )
                                    : [
                                        ...current,
                                        collection.id,
                                      ]
                              );
                            }}
                            className="mt-1 h-4 w-4"
                          />

                          <div>
                            <p className="font-medium text-stone-900">
                              {collection.name}
                            </p>

                            {collection.description && (
                              <p className="mt-1 text-sm text-stone-500">
                                {collection.description}
                              </p>
                            )}
                          </div>

                        </div>
                      </label>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* -------------------------------------------------
              Product Images
          ------------------------------------------------- */}

          <div className="mb-8 rounded-2xl border border-stone-200 p-5 sm:p-6">

            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add filenames of images already stored in{" "}
                <span className="font-medium text-stone-700">
                  public/images
                </span>
                .
              </p>
            </div>

            {images.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {images.map((imageName, index) => (
                  <div
                    key={`${imageName}-${index}`}
                    className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
                  >

                    <div className="aspect-square overflow-hidden bg-stone-100">

                      <img
                        src={`/images/${imageName}`}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>

                    <div className="p-3">

                      <p
                        className="truncate text-xs font-medium text-stone-700"
                        title={imageName}
                      >
                        {imageName}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImage(imageName)
                        }
                        className="mt-3 w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        Remove Image
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                <p className="text-sm text-stone-500">
                  No images added yet.
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-stone-200 pt-5">

              <label className="mb-2 block text-sm font-semibold text-stone-800">
                Add Image Filename
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  value={newImage}
                  onChange={(event) =>
                    setNewImage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddImage();
                    }
                  }}
                  placeholder="example.png"
                  className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-900"
                />

                <button
                  type="button"
                  onClick={handleAddImage}
                  className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Add Image
                </button>

              </div>

              <p className="mt-2 text-xs text-stone-500">
                Enter only the filename, such as{" "}
                <span className="font-medium text-stone-700">
                  antique-landline-2.png
                </span>
                .
              </p>

            </div>
          </div>

          {/* -------------------------------------------------
              Featured
          ------------------------------------------------- */}

          <div className="mb-8 rounded-2xl border border-stone-200 p-5">

            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(event.target.checked)
                }
                className="mt-1 h-4 w-4"
              />

              <span>

                <span className="block text-sm font-semibold text-stone-900">
                  Featured Product
                </span>

                <span className="mt-1 block text-xs text-stone-500">
                  Featured products can appear in the
                  homepage Featured Collection.
                </span>

              </span>

            </label>

          </div>

          {/* -------------------------------------------------
              Messages
          ------------------------------------------------- */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* -------------------------------------------------
              Actions
          ------------------------------------------------- */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push("/admin/products")
              }
              disabled={saving}
              className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Creating Product..."
                : "Create Product"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}