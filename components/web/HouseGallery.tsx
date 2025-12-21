import Image from "next/image";

export function HouseGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((src, i) => (
        <div key={i} className="relative h-64 rounded-xl overflow-hidden">
          <Image src={src} alt="House image" fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
