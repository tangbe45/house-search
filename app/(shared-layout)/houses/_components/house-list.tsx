"use client";
import { HouseCard } from "./house-card";
import url from "../../../../public/house/house.jpg";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HousesPagination } from "@/components/web/HousesPagination";

export default function HouseList() {
  const params = useSearchParams();
  const router = useRouter();
  const [houses, setHouses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [searchLocal, setSearchLocal] = useState(params.get("search") || "");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/houses?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        console.log(json);
        setHouses(json.houses || []);
        setTotal(json.total || 0);
        setPages(json.pages || 1);
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [params]);

  function goToPage(page: number) {
    const p = new URLSearchParams(params.toString());
    p.set("page", String(page));
    setCurrentPage(page);
    router.push(`/houses?${p.toString()}`);
  }

  return (
    <section>
      {houses.length > 0 ? (
        <div className="flex-1">
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 pb-8">
            {houses.map((house) => (
              <HouseCard
                key={house.id}
                title={house.title}
                price={house.price.toString()}
                location={house.location}
                bedrooms={house.bedrooms}
                bathrooms={house.bathrooms}
                hasFence={house.hasFence}
                hasInternalToilet={house.hasInternalToilet}
                imageUrl={house.imageUrl ?? url}
              />
            ))}
          </div>
          <HousesPagination
            currentPage={currentPage}
            totalPages={pages}
            onPageChange={goToPage}
          />
          <div className="mt-4 text-sm text-gray-600">
            Total: {total} results
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[calc(100vh-220px)]">
          <h3 className="text-white">No houses in the database yet</h3>
        </div>
      )}
    </section>
  );
}
