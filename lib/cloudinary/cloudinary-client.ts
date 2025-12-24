import "dotenv/config";

export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "habi_move");

  console.log("Ready to upload images");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  console.log("did i succeed to upload");
  console.log(res);
  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  console.log(data);

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
