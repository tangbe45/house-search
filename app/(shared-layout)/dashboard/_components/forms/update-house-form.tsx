"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
// import { updateHouse } from "@/app/houses/actions";

type ExistingImage = {
  id: string;
  url: string;
};

interface Props {
  house: {
    id: string;
    title: string;
    price: number;
    description?: string;
    images: ExistingImage[];
  };
}

export default function UpdateHouseForm({ house }: Props) {
  const [title, setTitle] = useState(house.title);
  const [price, setPrice] = useState(house.price);
  const [description, setDescription] = useState(house.description || "");

  const [existingImages, setExistingImages] = useState(house.images);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [isPending, startTransition] = useTransition();

  const MAX_IMAGES = 3;

  /* ---------------- Existing Images ---------------- */

  function removeExistingImage(imageId: string) {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  /* ---------------- New Images ---------------- */

  function addNewImages(files: FileList | null) {
    if (!files) return;

    const incoming = Array.from(files);

    const total = existingImages.length + newImages.length + incoming.length;

    if (total > MAX_IMAGES) {
      alert("You can only have up to 3 images.");
      return;
    }

    setNewImages((prev) => [...prev, ...incoming]);
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }

  /* ---------------- Submit ---------------- */

  function handleSubmit() {
    startTransition(async () => {
      const formData = new FormData();

      formData.append("houseId", house.id);
      formData.append("title", title);
      formData.append("price", String(price));
      formData.append("description", description);

      removedImageIds.forEach((id) => formData.append("removedImageIds", id));

      newImages.forEach((file) => formData.append("newImages", file));

      //   await updateHouse(formData);
    });
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid gap-4">
        <input
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="House title"
        />

        <input
          type="number"
          className="border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price"
        />

        <textarea
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>

      {/* Existing Images */}
      <section>
        <h3 className="font-semibold mb-2">Existing Images</h3>

        <div className="flex gap-3">
          {existingImages.map((img) => (
            <div key={img.id} className="relative">
              <Image
                src={img.url}
                alt=""
                width={120}
                height={120}
                className="rounded object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(img.id)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* New Images */}
      <section>
        <h3 className="font-semibold mb-2">Add New Images</h3>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => addNewImages(e.target.files)}
        />

        <div className="flex gap-3 mt-3">
          {newImages.map((file, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="h-[120px] w-[120px] rounded object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Save Changes"}
      </button>
    </div>
  );
}
