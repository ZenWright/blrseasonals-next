"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

type Category = {
  id: number;
  name: string;
  description: string;
};

type ProductFiltersProps = {
  products: Product[];
};

export default function ProductFilters({
  products,
}: ProductFiltersProps) {
    const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [collection, setCollection] = useState("All");
  const [maxPrice, setMaxPrice] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // =========================================================
  // Load Categories From FastAPI
  // =========================================================

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data: Category[] = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Category loading failed:", error);

        // Fallback:
        // Use categories already available on products.
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  // =========================================================
  // Read Filters From URL
  // =========================================================

    useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const collectionFromUrl = searchParams.get("collection");

    setCategory(categoryFromUrl || "All");
    setCollection(collectionFromUrl || "All");
  }, [searchParams]);

  // =========================================================
  // Category Names
  // =========================================================

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) {
      return [
        "All",
        ...categories.map((item) => item.name),
      ];
    }

    return [
      "All",
      ...new Set(
        products.map((product) => product.category)
      ),
    ];
  }, [categories, products]);

  // =========================================================
  // Seasonal Collection Names
  // =========================================================

  const collectionOptions = useMemo(() => {
    const collectionNames = new Set<string>();

    products.forEach((product) => {
      product.seasonal_collections.forEach(
        (item) => collectionNames.add(item)
      );
    });

    return [
      "All",
      ...Array.from(collectionNames).sort(),
    ];
  }, [products]);

  // =========================================================
  // Filter Products
  // =========================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category.trim() === category.trim();

      const matchesCollection =
        collection === "All" ||
        product.seasonal_collections.includes(collection);

      const matchesPrice =
        maxPrice === "All" ||
        product.price <= Number(maxPrice);

      const matchesFeatured =
        !featuredOnly || product.featured;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCollection &&
        matchesPrice &&
        matchesFeatured
      );
    });
  }, [
    products,
    search,
    category,
    collection,
    maxPrice,
    featuredOnly,
  ]);

  // =========================================================
  // Category Change
  // =========================================================

  const handleCategoryChange = (
    selectedCategory: string
  ) => {
    setCategory(selectedCategory);

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (selectedCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }

    const queryString = params.toString();

    router.replace(
      queryString
        ? `/products?${queryString}`
        : "/products"
    );
  };

  // =========================================================
  // Collection Change
  // =========================================================

  const handleCollectionChange = (
    selectedCollection: string
  ) => {
    setCollection(selectedCollection);

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (selectedCollection === "All") {
      params.delete("collection");
    } else {
      params.set("collection", selectedCollection);
    }

    const queryString = params.toString();

    router.replace(
      queryString
        ? `/products?${queryString}`
        : "/products"
    );
  };

  // =========================================================
  // Clear Filters
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setCollection("All");
    setMaxPrice("All");
    setFeaturedOnly(false);

    router.replace("/products");
  };

  return (
    <div>

      {/* =====================================================
          Filters
      ===================================================== */}

      <div className="mb-10 rounded-2xl border border-black/10 bg-white p-5 md:p-6">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

          {/* Search */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value
                )
              }
              disabled={categoriesLoading}
              className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black disabled:cursor-wait disabled:bg-gray-50"
            >
              {categoriesLoading ? (
                <option value="All">
                  Loading categories...
                </option>
              ) : (
                categoryOptions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Seasonal Collection */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Seasonal Collection
            </label>

            <select
              value={collection}
              onChange={(event) =>
                handleCollectionChange(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
            >
              {collectionOptions.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Collections"
                    : item}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Maximum Price
            </label>

            <select
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
            >
              <option value="All">
                All Prices
              </option>

              <option value="500">
                Under ₹500
              </option>

              <option value="1000">
                Under ₹1,000
              </option>

              <option value="1500">
                Under ₹1,500
              </option>

              <option value="2000">
                Under ₹2,000
              </option>

              <option value="5000">
                Under ₹5,000
              </option>
            </select>
          </div>

          {/* Featured */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Collection
            </label>

            <button
              type="button"
              onClick={() =>
                setFeaturedOnly(
                  !featuredOnly
                )
              }
              className={`h-11 w-full rounded-xl border px-4 text-sm font-medium transition ${
                featuredOnly
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white text-gray-700 hover:border-black"
              }`}
            >
              {featuredOnly
                ? "✓ Featured Only"
                : "All Products"}
            </button>
          </div>

        </div>

        {/* Filter Footer */}

        <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-gray-600 underline underline-offset-4 transition hover:text-black"
          >
            Clear Filters
          </button>

        </div>

      </div>

      {/* =====================================================
          Product Grid
      ===================================================== */}

      {filteredProducts.length > 0 ? (

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      ) : (

        <div className="rounded-2xl border border-black/10 bg-white px-6 py-20 text-center">

          <h2 className="font-serif text-2xl font-bold">
            No Products Found
          </h2>

          <p className="mt-3 text-gray-600">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Clear Filters
          </button>

        </div>

      )}

    </div>
  );
}