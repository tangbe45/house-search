import { AgentCard } from "@/components/web/AgentCard";
import { HouseGallery } from "@/components/web/HouseGallery";
import { getHouseById } from "../actions";
import url from "../../../../public/avatar/avatar.jpg";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface HousePageProps {
  params: Promise<{ id: string }>;
}

export default async function HouseDetailsPage({ params }: HousePageProps) {
  // Replace with real DB call
  const { id } = await params;
  const houseData: any = await getHouseById(id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-1 sm:px-4 py-6 space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{houseData?.title}</h1>
        </div>

        {/* Gallery */}
        <HouseGallery images={houseData?.images ?? []} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* House Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">House Information</h2>
                <span className="text-2xl font-bold text-primary">
                  {houseData?.price.toLocaleString()} FCFA
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                {houseData?.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem label="Bedrooms" value={houseData?.bedrooms} />
                <InfoItem label="Bathrooms" value={houseData?.bathrooms} />
                <InfoItem label="Location" value={houseData?.location} />
                <InfoItem label="Posted" value={houseData?.createdAt} />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                <Feature
                  label="Internal Toilet"
                  value={houseData?.hasInternalToilet}
                />
                <Feature label="Well" value={houseData?.hasWell} />
                <Feature label="Parking" value={houseData?.hasParking} />
                <Feature label="Fence" value={houseData?.hasFence} />
                <Feature label="Balcony" value={houseData?.hasBalcony} />
              </ul>
            </div>
          </div>

          {/* Agent Card */}
          <AgentCard
            agent={{
              name: "Jean Dupont",
              email: "jean@example.com",
              phone: "+237670000000",
              whatsapp: "+237670000000",
              avatar: url,
            }}
          />
        </div>
        <Link href="/houses" className={`${buttonVariants()} `}>
          &larr; Back to Houses
        </Link>
      </div>
    </div>
  );
}

/* Helpers */
function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Feature({ label, value }: { label: string; value?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          value ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {label}
    </li>
  );
}

/* Fake fetch */
async function getHouse(id: string) {
  return {
    id,
    title: "Modern 3 Bedroom House",
    description: "A spacious and modern house located in a calm neighborhood.",
    location: "Bastos, Yaoundé",
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    hasInternalToilet: true,
    hasWell: false,
    hasParking: true,
    hasFence: true,
    hasBalcony: true,
    images: ["/house1.jpg", "/house2.jpg", "/house3.jpg"],
    createdAt: new Date().toDateString(),
    agent: {
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+237670000000",
      whatsapp: "+237670000000",
      avatar: url,
    },
  };
}
