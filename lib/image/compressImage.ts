// ---- simple helper to compress images in browser ----
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.75
) {
  if (!file) return file;
  const img = document.createElement("img");
  const objectURL = URL.createObjectURL(file);
  img.src = objectURL;

  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("Image load error"));
  });

  const canvas = document.createElement("canvas");
  const ratio = img.width / img.height;
  const width = Math.min(img.width, maxWidth);
  const height = Math.round(width / ratio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
  );

  URL.revokeObjectURL(objectURL);
  if (!blob) throw new Error("Compression failed");

  const compressedFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
  return compressedFile;
}
