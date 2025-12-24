"use client";
// export default function HouseCard({ house }: { house: any }) {
//   return (
//     <article className="border rounded shadow-sm overflow-hidden">
//       <div className="h-44 bg-gray-100">
//         <img
//           src={house.images?.[0]?.url || "/placeholder.png"}
//           alt={house.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="p-3 bg-slate-950">
//         <h3 className="font-semibold text-slate-100">{house.title}</h3>
//         <p className="text-sm text-gray-600 line-clamp-2">
//           {house.description}
//         </p>
//         <div className="flex items-center justify-between mt-3">
//           <div className="text-sm text-gray-500">{house.purpose}</div>
//           <div className="font-bold">{house.price} XAF</div>
//         </div>
//       </div>
//     </article>
//   );
// }

// import Image from "next/image";
// import { HeartIcon, ChartNetworkIcon } from "lucide-react";
// import houseUrl from "../../../../public/house/house.jpg";
// import avatarUrl from "../../../../public/avatar/avatar.jpg";
// import { CldImage } from "next-cloudinary";
// import Link from "next/link";

// type HouseCardProps = {
//   house: {
//     id: string;
//     title: string;
//     price: number;
//     location: string;
//     bedrooms: number | null;
//     bathrooms: number | null;
//     images: {
//       url: string;
//       id: string;
//     }[];
//   };
// };

// export const HouseCard = ({ house }: HouseCardProps) => {
//   const url = house.images.length > 0 ? house.images[0].url : houseUrl;
//   console.log(url);
//   return (
//     <article
//       aria-labelledby={`house-${house.id}-title`}
//       className="group card bg-slate-950 text-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
//     >
//       <Link href={`/houses/${house.id}`} className="block">
//         {/* Thumbnail */}
//         <div className="relative w-full h-56 overflow-hidden">
//           <div className="absolute inset-0 transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
//             {/* <Image
//               src={url}
//               alt={house.title}
//               priority
//               fill
//               sizes="(max-width: 640px) 100vw, 360px"
//               className="object-cover w-full h-full"
//             /> */}
//             <CldImage
//               width={600}
//               height={400}
//               src={house.images[0].url}
//               alt="house photo"
//             />
//           </div>

//           {/* Overlay */}
//           <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//           {/* Action buttons */}
//           <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <div className="flex gap-2">
//               <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow">
//                 <HeartIcon size={16} />
//               </button>
//               <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow">
//                 <ChartNetworkIcon size={16} />
//               </button>
//             </div>
//             <div className="rounded-md bg-black/80 text-white text-xs px-2 py-0.5">
//               {"12:47"}
//             </div>
//           </div>
//         </div>

//         {/* Metadata */}
//         <div className="p-3">
//           <div className="flex justify-between items-start gap-3">
//             <div className="min-w-0">
//               <h3
//                 id={`house-${house.id}-title`}
//                 className="text-sm font-semibold truncate"
//               >
//                 {house.title}
//               </h3>
//               <p className="mt-1 text-sm text-slate-600 truncate">
//                 {house.location}
//               </p>
//               <p className="mt-2 text-lg font-extrabold text-red-600">
//                 {formatPrice(house.price)}
//               </p>
//               <div className="mt-2 text-xs text-slate-500 flex gap-3">
//                 <span>{house.bedrooms} bd</span>
//                 <span>{house.bathrooms} ba</span>
//                 <span>{1200} sqft</span>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100">
//                 <Image
//                   src={avatarUrl}
//                   alt={"Owner's Avatar"}
//                   priority
//                   width={36}
//                   height={36}
//                   className="object-cover"
//                 />
//               </div>
//               <div className="mt-2 text-xs text-slate-500">
//                 <div>{2000} views</div>
//                 <div>
//                   {timeAgo(
//                     new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>
//     </article>
//   );
// };

// function formatPrice(p: number) {
//   return p >= 1000 ? `$${(p / 1000).toFixed(1)}k` : `$${p}`;
// }

// function timeAgo(iso: string) {
//   const then = new Date(iso);
//   const now = new Date();
//   const sec = Math.floor((now.getTime() - then.getTime()) / 1000);
//   if (sec < 60) return `${sec}s ago`;
//   const min = Math.floor(sec / 60);
//   if (min < 60) return `${min}m ago`;
//   const hr = Math.floor(min / 60);
//   if (hr < 24) return `${hr}h ago`;
//   const day = Math.floor(hr / 24);
//   return `${day}d ago`;
// }

import { CldImage } from "next-cloudinary";

import { MapPin, BedDouble, Bath, Check, X } from "lucide-react";

type HouseCardProps = {
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  hasFence: boolean;
  hasInternalToilet: boolean;
  hasWell: boolean;
  imageUrl: string;
};

export function HouseCard({
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  hasFence,
  hasInternalToilet,
  hasWell,
  imageUrl,
}: HouseCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg dark:border-white/10 dark:bg-zinc-900 dark:hover:shadow-black/40">
      {/* Image */}
      <div className="relative h-52 sm:h-56 md:h-64 overflow-hidden">
        <CldImage
          width={600}
          height={400}
          src={imageUrl}
          alt="house photo"
          className="object-cover"
        />

        {/* Price badge */}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-red-500 backdrop-blur">
          {price} CFA
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 opacity-70" />
            <span>{bedrooms} Beds</span>
          </div>

          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 opacity-70" />
            <span>{bathrooms} Baths</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 pt-2">
          <FeatureBadge label="Fence" enabled={hasFence} />
          <FeatureBadge label="Internal Toilet" enabled={hasInternalToilet} />
          <FeatureBadge label="Well" enabled={hasWell} />
        </div>
      </div>
    </div>
  );
}

function FeatureBadge({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
        ${
          enabled
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-white/5 text-gray-400"
        }
      `}
    >
      {enabled ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </span>
  );
}
