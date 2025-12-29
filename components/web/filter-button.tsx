"use client";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FilterForm from "@/app/(shared-layout)/houses/_components/filter-form";
import { useEffect, useState } from "react";
import { HouseFilter, HouseType, LocationData } from "@/types";

export const initializeHouseFilter = {
  houseType: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  purpose: "FOR_RENT",
  hasInternalToilet: false,
  hasWell: false,
  hasParking: false,
  hasFence: false,
  hasBalcony: false,
  forRent: undefined,
  forSale: undefined,
  region: "",
  division: "",
  subdivision: "",
  neighborhood: "",
};

export const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [houseTypes, setHouseTypes] = useState<HouseType[]>([]);
  const [filter, setFilter] = useState<HouseFilter>(initializeHouseFilter);
  const [location, setLocation] = useState<LocationData>({
    regions: "",
    divisions: "",
    subdivisions: "",
    neighborhoods: "",
  });

  useEffect(() => {
    async function loadFilters() {
      const [types_result, regions_result] = await Promise.all([
        fetch("/api/house-types"),
        fetch("/api/regions"),
      ]);

      const regions = await regions_result.json();
      const types = await types_result.json();
      console.log(regions);

      setLocation({ ...location, regions: regions });
      setHouseTypes(types);
    }
    const time = setTimeout(() => {
      loadFilters();
    }, 1000);

    return () => clearTimeout(time);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <SlidersHorizontal size={4} />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>House Filter</DialogTitle>
          <DialogDescription>
            Reduce the number of house to the area of interest
          </DialogDescription>
        </DialogHeader>
        <FilterForm
          houseTypes={houseTypes}
          filter={filter}
          location={location}
          resetForm={() => setFilter(initializeHouseFilter)}
          onSetLocation={(key, value) =>
            setLocation((prev) => ({ ...prev, [key]: value }))
          }
          onSetFilter={(key, value) =>
            setFilter((prev) => ({ ...prev, [key]: value }))
          }
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
