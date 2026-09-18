"use client";



import { FormEvent, useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { useParams, useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";



type Category = {

id: number;

name: string;

};



type Product = {

id: number;

name: string;

description: string | null;

price: number;

mrp: number | null;

inventory: number;

category_id: number | null;

category: string | null;

featured: boolean;

images: string[];

};



export default function EditProductPage() {

const router = useRouter();

const params = useParams();



const productId = params.id as string;



const [product, setProduct] = useState<Product | null>(null);

const [categories, setCategories] = useState<Category[]>([]);



const [checkingAuth, setCheckingAuth] = useState(true);

const [loading, setLoading] = useState(true);

const [saving, setSaving] = useState(false);



const [error, setError] = useState("");

const [success, setSuccess] = useState("");



const [title, setTitle] = useState("");

const [description, setDescription] = useState("");

const [price, setPrice] = useState("");

const [mrp, setMrp] = useState("");

const [inventory, setInventory] = useState("");

const [categoryId, setCategoryId] = useState("");

const [featured, setFeatured] = useState(false);

const [seasonalCollections, setSeasonalCollections] = useState<

{

id: number;

name: string;

description: string | null;

is_active: boolean;

start_date: string | null;

end_date: string | null;

}[]

>([]);



const [selectedSeasonalCollections, setSelectedSeasonalCollections] =

useState<number[]>([]);



const [seasonalCollectionsLoading, setSeasonalCollectionsLoading] =

useState(false);



const [seasonalCollectionsSaving, setSeasonalCollectionsSaving] =

useState(false);



const [images, setImages] = useState<string[]>([]);

const [newImage, setNewImage] = useState("");

const [savingImages, setSavingImages] = useState(false);



useEffect(() => {

const unsubscribe = onAuthStateChanged(auth, async (user) => {

if (!user) {

router.replace("/admin/login");

return;

}



try {

const tokenResult = await user.getIdTokenResult();



const isAdmin = tokenResult.claims.admin === true;



if (!isAdmin) {

router.replace("/admin/login");

return;

}



setCheckingAuth(false);



const token = await user.getIdToken();



const [
  productResponse,
  categoriesResponse,
  seasonalCollectionsResponse,
  productSeasonalResponse,
] = await Promise.all([
  fetch(`http://127.0.0.1:8000/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }),
  fetch("http://127.0.0.1:8000/categories", {
    cache: "no-store",
  }),
  fetch("http://127.0.0.1:8000/admin/seasonal-collections", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }),
  fetch(
    `http://127.0.0.1:8000/admin/products/${productId}/seasonal-collections`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  ),
]);

if (!productResponse.ok) {
  throw new Error("Failed to load product.");
}

if (!categoriesResponse.ok) {
  throw new Error("Failed to load categories.");
}

if (!seasonalCollectionsResponse.ok) {
  throw new Error("Failed to load seasonal collections.");
}

if (!productSeasonalResponse.ok) {
  throw new Error("Failed to load product seasonal collections.");
}

const productData = await productResponse.json();
const categoriesData = await categoriesResponse.json();
const seasonalCollectionsData =
  await seasonalCollectionsResponse.json();
const productSeasonalData =
  await productSeasonalResponse.json();





setProduct(productData);

setCategories(categoriesData);

setSeasonalCollections(

Array.isArray(seasonalCollectionsData)

? seasonalCollectionsData

: []

);



setSelectedSeasonalCollections(

Array.isArray(productSeasonalData.collection_ids)

? productSeasonalData.collection_ids

: []

);

setSeasonalCollectionsLoading(false);



setTitle(productData.name || "");

setDescription(productData.description || "");

setPrice(String(productData.price ?? ""));

setMrp(

productData.mrp !== null &&

productData.mrp !== undefined

? String(productData.mrp)

: ""

);

setInventory(String(productData.inventory ?? 0));



setCategoryId(

productData.category_id !== null &&

productData.category_id !== undefined

? String(productData.category_id)

: ""

);



setFeatured(Boolean(productData.featured));



setImages(

Array.isArray(productData.images)

? productData.images.map((image: string) =>

image.replace(/^\/images\//, "")

)

: []

);

} catch (error) {

console.error("Failed to load edit product:", error);

setError("Unable to load product.");

setCheckingAuth(false);
setSeasonalCollectionsLoading(false);

} finally {

setLoading(false);

}

});



return () => unsubscribe();

}, [productId, router]);



async function handleSaveImages() {

setError("");

setSuccess("");

setSavingImages(true);



try {

const user = auth.currentUser;



if (!user) {

router.replace("/admin/login");

return;

}



const token = await user.getIdToken(true);



const response = await fetch(

`http://127.0.0.1:8000/admin/products/${productId}/images`,

{

method: "PUT",

headers: {

"Content-Type": "application/json",

Authorization: `Bearer ${token}`,

},

body: JSON.stringify({

images,

}),

}

);



const data = await response.json();



if (!response.ok) {

throw new Error(

data.detail || "Failed to update product images."

);

}



setSuccess("Product images updated successfully.");

} catch (error) {

console.error("Product image update failed:", error);



setError(

error instanceof Error

? error.message

: "Failed to update product images."

);

} finally {

setSavingImages(false);

}

}



function handleAddImage() {

const imageName = newImage.trim();



if (!imageName) {

return;

}



if (

imageName.includes("/") ||

imageName.includes("\\\\")

) {

setError("Enter the image filename only, for example: clock.png");

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

setSuccess("");

}



function handleRemoveImage(imageName: string) {

if (images.length === 1) {

setError("A product must have at least one image.");

return;

}



setImages((currentImages) =>

currentImages.filter(

(image) => image !== imageName

)

);



setError("");

setSuccess("");

}



async function handleSaveSeasonalCollections() {
  setError("");
  setSuccess("");
  setSeasonalCollectionsSaving(true);

  try {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    const token = await user.getIdToken(true);

    const response = await fetch(
      `http://127.0.0.1:8000/admin/products/${productId}/seasonal-collections`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          collection_ids: selectedSeasonalCollections,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to update seasonal collections."
      );
    }

    setSuccess("Seasonal collections updated successfully.");
  } catch (error) {
    console.error("Seasonal collection update failed:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to update seasonal collections."
    );
  } finally {
    setSeasonalCollectionsSaving(false);
  }
}

async function handleSubmit(event: FormEvent<HTMLFormElement>) {

event.preventDefault();



setError("");

setSuccess("");

setSaving(true);



try {

const user = auth.currentUser;



if (!user) {

router.replace("/admin/login");

return;

}



const token = await user.getIdToken(true);



const response = await fetch(

`http://127.0.0.1:8000/admin/products/${productId}`,

{

method: "PUT",

headers: {

"Content-Type": "application/json",

Authorization: `Bearer ${token}`,

},

body: JSON.stringify({

title: title.trim(),

description: description.trim() || null,

price: Number(price),

mrp: mrp === "" ? null : Number(mrp),

inventory: Number(inventory),

category_id:

categoryId === ""

? null

: Number(categoryId),

featured,

}),

}

);



const data = await response.json();



if (!response.ok) {

throw new Error(

data.detail || "Failed to update product."

);

}



setSuccess("Product updated successfully.");



setTimeout(() => {

router.push("/admin/products");

}, 800);

} catch (error) {

console.error("Product update failed:", error);



setError(

error instanceof Error

? error.message

: "Failed to update product."

);

} finally {

setSaving(false);

}

}



if (checkingAuth || loading) {

return (

<main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">

<div className="rounded-2xl border border-stone-200 bg-white px-8 py-6 text-center shadow-sm">

<p className="text-sm text-stone-600">

Loading product...

</p>

</div>

</main>

);

}



if (!product && error) {

return (

<main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-6">

<div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

<h1 className="text-xl font-semibold text-red-800">

Unable to load product

</h1>



<p className="mt-3 text-sm text-red-700">

{error}

</p>



<button

type="button"

onClick={() => router.push("/admin/products")}

className="mt-6 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"

>

Back to Products

</button>

</div>

</main>

);

}



return (

<main className="min-h-screen bg-[#f7f3ee] px-6 py-10">

<div className="mx-auto max-w-4xl">

{/* Header */}



<div className="mb-8">

<button

type="button"

onClick={() => router.push("/admin/products")}

className="text-sm font-medium text-stone-500 transition hover:text-stone-900"

>

← Back to Products

</button>



<p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-stone-500">

BLR Seasonals

</p>



<h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">

Edit Product

</h1>



<p className="mt-2 text-stone-600">

Update product information, pricing and inventory.

</p>

</div>



{/* Form */}



<form

onSubmit={handleSubmit}

className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"

>

{/* Product ID */}



<div className="mb-8 rounded-xl bg-stone-50 p-4">

<p className="text-xs font-medium uppercase tracking-wider text-stone-500">

Product ID

</p>



<p className="mt-1 font-semibold text-stone-900">

#{productId}

</p>

</div>



{/* Images */}



<div className="mb-8 rounded-2xl border border-stone-200 p-5 sm:p-6">

<div className="mb-5">

<h2 className="text-lg font-semibold text-stone-900">

Product Images

</h2>



<p className="mt-1 text-sm text-stone-500">

Manage the images used for this product.

Image files must already exist in

<span className="font-medium text-stone-700">

{" "}public/images

</span>.

</p>

</div>



{images.length > 0 ? (

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

{images.map((imageName, index) => (

<div

key={`${imageName}-${index}`}

className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50"

>

<div className="aspect-square overflow-hidden bg-stone-100">

<img

src={`/images/${imageName}`}

alt={`${title || "Product"} image ${index + 1}`}

className="h-full w-full object-cover"

onError={(event) => {

event.currentTarget.style.display = "none";

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

<div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">

<p className="text-sm text-stone-500">

No images added.

</p>

</div>

)}



<div className="mt-6 border-t border-stone-200 pt-5">

<label className="mb-2 block text-sm font-semibold text-stone-700">

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

className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"

placeholder="example.png"

/>



<button

type="button"

onClick={handleAddImage}

className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"

>

Add Image

</button>

</div>



<p className="mt-2 text-xs text-stone-500">

Enter only the filename, such as

<span className="font-medium text-stone-700">

{" "}antique-landline.png

</span>. Do not enter /images/ or a full URL.

</p>



<button

type="button"

onClick={handleSaveImages}

disabled={savingImages || images.length === 0}

className="mt-5 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"

>

{savingImages

? "Saving Images..."

: "Save Images"}

</button>

</div>

</div>



{/* Title */}



<div className="mb-6">

<label className="mb-2 block text-sm font-semibold text-stone-700">

Product Title

</label>



<input

type="text"

value={title}

onChange={(event) =>

setTitle(event.target.value)

}

required

className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"

placeholder="Enter product title"

/>

</div>



{/* Description */}



<div className="mb-6">

<label className="mb-2 block text-sm font-semibold text-stone-700">

Description

</label>



<textarea

value={description}

onChange={(event) =>

setDescription(event.target.value)

}

rows={5}

className="w-full resize-y rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"

placeholder="Enter product description"

/>

</div>



{/* Price Grid */}



<div className="mb-6 grid gap-6 sm:grid-cols-2">

<div>

<label className="mb-2 block text-sm font-semibold text-stone-700">

Selling Price (₹)

</label>



<input

type="number"

min="0"

value={price}

onChange={(event) =>

setPrice(event.target.value)

}

required

className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"

placeholder="600"

/>

</div>



<div>

<label className="mb-2 block text-sm font-semibold text-stone-700">

MRP (₹)

</label>



<input

type="number"

min="0"

value={mrp}

onChange={(event) =>

setMrp(event.target.value)

}

className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"

placeholder="1000"

/>

</div>

</div>



{/* Inventory + Category */}



<div className="mb-6 grid gap-6 sm:grid-cols-2">

<div>

<label className="mb-2 block text-sm font-semibold text-stone-700">

Inventory

</label>



<input

type="number"

min="0"

value={inventory}

onChange={(event) =>

setInventory(event.target.value)

}

required

className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"

placeholder="10"

/>

</div>



<div>

<label className="mb-2 block text-sm font-semibold text-stone-700">

Category

</label>



<select

value={categoryId}

onChange={(event) =>

setCategoryId(event.target.value)

}

className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900"

>

<option value="">

Uncategorized

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



{/* Featured */}



<div className="mb-8 rounded-xl border border-stone-200 p-4">

<label className="flex cursor-pointer items-center gap-3">

<input

type="checkbox"

checked={featured}

onChange={(event) =>

setFeatured(event.target.checked)

}

className="h-4 w-4"

/>



<span className="text-sm font-semibold text-stone-700">

Featured Product

</span>

</label>



<p className="mt-2 text-xs text-stone-500">

Featured products can appear in the homepage

Featured Collection.

</p>

</div>

{/* Seasonal Collections */}

<div className="mt-8 border-t border-gray-200 pt-8">

<div className="mb-4">

<h2 className="text-lg font-semibold text-gray-900">

Seasonal Collections

</h2>

<p className="mt-1 text-sm text-gray-500">

Select the seasonal collections where this product should appear.

</p>

</div>



{seasonalCollectionsLoading ? (

<p className="text-sm text-gray-500">

Loading seasonal collections...

</p>

) : seasonalCollections.length === 0 ? (

<p className="text-sm text-gray-500">

No active seasonal collections available.

</p>

) : (

<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

{seasonalCollections

.filter((collection) => collection.is_active)

.map((collection) => {

const isSelected = selectedSeasonalCollections.includes(

collection.id

);



return (

<label

key={collection.id}

className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${

isSelected

? "border-black bg-gray-50"

: "border-gray-200 bg-white hover:border-gray-400"

}`}

>

<input

type="checkbox"

checked={isSelected}

onChange={() => {

setSelectedSeasonalCollections((current) =>

current.includes(collection.id)

? current.filter(

(id) => id !== collection.id

)

: [...current, collection.id]

);

}}

className="mt-1 h-4 w-4"

/>



<div>

<p className="font-medium text-gray-900">

{collection.name}

</p>



{collection.description && (

<p className="mt-1 text-sm text-gray-500">

{collection.description}

</p>

)}

</div>

</label>

);

})}

</div>

)}

</div>



<button
  type="button"
  onClick={handleSaveSeasonalCollections}
  disabled={seasonalCollectionsLoading || seasonalCollectionsSaving}
  className="mt-5 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
>
  {seasonalCollectionsSaving
    ? "Saving Seasonal Collections..."
    : "Save Seasonal Collections"}
</button>

{/* Error */}



{error && (

<div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

{error}

</div>

)}



{/* Success */}



{success && (

<div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">

{success}

</div>

)}



{/* Buttons */}



<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

<button

type="button"

onClick={() => router.push("/admin/products")}

className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"

>

Cancel

</button>



<button

type="submit"

disabled={saving}

className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"

>

{saving ? "Saving..." : "Save Changes"}

</button>

</div>

</form>

</div>

</main>

);

}
