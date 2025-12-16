import HouseList from "./_components/house-list";
import { FilterButton } from "@/components/web/filter-button";

export default function HousesPage() {
  return (
    <section className="min-h-screen w-full">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">Houses</h1>
        <div>
          <FilterButton />
        </div>
      </div>
      <HouseList />
    </section>
  );
}
