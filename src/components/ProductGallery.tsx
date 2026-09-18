"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const safeImages = images.length > 0 ? images : ["/images/placeholder.png"];

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
        <div className="flex min-h-[420px] items-center justify-center p-8 md:min-h-[560px] md:p-12">
          <img
            src={safeImages[selectedImage]}
            alt={`${productName} - image ${selectedImage + 1}`}
            className="max-h-[520px] w-full object-contain transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`View ${productName} image ${index + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-white transition ${
                selectedImage === index
                  ? "border-black ring-2 ring-black/10"
                  : "border-black/10 hover:border-black/30"
              }`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image count */}
      <p className="mt-3 text-center text-xs text-gray-500">
        {safeImages.length === 1
          ? "1 product image"
          : `${safeImages.length} product images`}
      </p>
    </div>
  );
}