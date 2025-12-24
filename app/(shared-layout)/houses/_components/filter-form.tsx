"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { HouseFilter, HouseType, LocationData } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const initializeHouseFilter = {
  houseType: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
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

type FilterFormProps = {
  onClose: () => void;
};

const FilterForm = ({ onClose }: FilterFormProps) => {
  const router = useRouter();

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

  function applyFilters() {
    const params = new URLSearchParams();

    if (filter.houseType) params.set("houseType", filter.houseType);
    if (filter.purpose) params.set("purpose", filter.purpose);
    if (filter.minPrice) params.set("minPrice", filter.minPrice);
    if (filter.maxPrice) params.set("maxPrice", filter.maxPrice);
    if (filter.hasInternalToilet)
      params.set("hasInternalToilet", String(filter.hasInternalToilet));
    if (filter.hasParking) params.set("hasParking", String(filter.hasParking));
    if (filter.hasWell) params.set("hasWell", String(filter.hasWell));
    if (filter.region) params.set("region", filter.region);
    if (filter.division) params.set("division", filter.division);
    if (filter.subdivision) params.set("subdivision", filter.subdivision);
    if (filter.neighborhood) params.set("neighbourhood", filter.neighborhood);
    params.set("page", "1");
    params.set("size", "9");
    router.push(`/houses?${params.toString()}`);
    onClose();
  }

  const handleChange = async (key: string, value: string | boolean) => {
    setFilter((prev) => ({ ...prev, [key]: value }));

    if (key === "region" && typeof value === "string") {
      console.log(key);
      const result = await fetch(`/api/divisions?regionId=${value}`);
      const divisions = await result.json();
      console.log(divisions);
      setLocation(() => ({ ...location, divisions }));
      console.log(result);
    }

    if (key === "division" && typeof value === "string") {
      const result = await fetch(`/api/subdivisions?divisionId=${value}`);
      const subdivisions = await result.json();
      setLocation(() => ({ ...location, subdivisions }));
      console.log(result);
    }

    if (key === "subdivision" && typeof value === "string") {
      const result = await fetch(`/api/neighborhoods?subdivisionId=${value}`);
      const neighborhoods = await result.json();
      setLocation(() => ({ ...location, neighborhoods }));
      console.log(result);
    }
  };

  function clearFilters() {
    router.push(`/houses`);
    setFilter(initializeHouseFilter);
    onClose();
  }

  return (
    <div className="space-y-4 overflow-y-scroll max-h-[80vh] pr-2">
      <div>
        <Label className="mb-4">Purpose</Label>
        <RadioGroup defaultValue="FOR_RENT" className="flex gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FOR_RENT" id="for_rent" />
            <Label htmlFor="for_rent">For rent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FOR_SALE" id="for_sale" />
            <Label htmlFor="for_sale">For sale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SHORT_STAY" id="short_stay" />
            <Label htmlFor="short_stay">Short stay</Label>
          </div>
        </RadioGroup>
      </div>
      <Separator className="my-2" />
      {/* Location Group */}
      <div className="space-y-3">
        <p className="font-medium text-slate-800">Location</p>

        <div className="grid grid-cols-2 sm:ml-4 sm:grid-cols-2 gap-3">
          <div>
            <Label className="filter-label mb-1">Region</Label>
            <Select
              value={filter.region}
              onValueChange={(value) => handleChange("region", value)}
            >
              <SelectTrigger className="max-w-32 sm:max-w-40" size="sm">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {location.regions === "" ||
                  location.regions.map((item) => (
                    <SelectItem
                      className="truncate"
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="filter-label mb-1">Division</Label>
            <Select
              value={filter.division}
              onValueChange={(value) => handleChange("division", value)}
              disabled={!location.divisions}
            >
              <SelectTrigger className="max-w-32 sm:max-w-40" size="sm">
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {location.divisions &&
                  location.divisions.map((item) => (
                    <SelectItem
                      className="truncate"
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="filter-label mb-1">Subdivision</Label>
            <Select
              disabled={!location.subdivisions}
              value={filter.subdivision}
              onValueChange={(value) => handleChange("subdivision", value)}
            >
              <SelectTrigger className="max-w-32 sm:max-w-44" size="sm">
                <SelectValue placeholder="Select subdivision" />
              </SelectTrigger>
              <SelectContent>
                {location &&
                  location.subdivisions &&
                  location.subdivisions.map((item) => (
                    <SelectItem
                      className="truncate"
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="filter-label mb-1">Neighborhood</Label>
            <Select
              disabled={!location.neighborhoods}
              value={filter.neighborhood}
              onValueChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  neighborhood: value,
                }))
              }
            >
              <SelectTrigger className="max-w-32 sm:max-w-44" size="sm">
                <SelectValue placeholder="Select neighborhood" />
              </SelectTrigger>
              <SelectContent>
                {location &&
                  location.neighborhoods &&
                  location.neighborhoods.map((item) => (
                    <SelectItem
                      className="truncate"
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      {/* House Type */}
      <div>
        <Label className="filter-label mb-1">House Type</Label>
        <Select
          value={filter.houseType}
          onValueChange={(value) => handleChange("houseType", value)}
        >
          <SelectTrigger size="sm" className="max-w-48">
            <SelectValue placeholder="Select house type" />
          </SelectTrigger>
          <SelectContent>
            {houseTypes.map((item) => (
              <SelectItem className="truncate" key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Price Range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="filter-label">Min Price</Label>
          <Input
            style={{ height: "2rem" }}
            type="number"
            placeholder="e.g. 50000"
            value={filter.minPrice}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                minPrice: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="filter-label">Max Price</Label>
          <Input
            style={{ height: "2rem" }}
            type="number"
            placeholder="e.g. 300000"
            value={filter.maxPrice}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                maxPrice: e.target.value,
              }))
            }
          />
        </div>
      </div>
      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="flex items-center space-x-4">
          <Switch
            id="internalToilet"
            checked={filter.hasInternalToilet}
            onCheckedChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                hasInternalToilet: !filter.hasInternalToilet,
              }))
            }
          />
          <Label htmlFor="internalToilet">Has Internal Toilet</Label>
        </div>
        <div className="flex items-center space-x-4">
          <Switch
            id="well"
            checked={filter.hasWell}
            onCheckedChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                hasWell: !filter.hasWell,
              }))
            }
          />
          <Label htmlFor="well">Has Well</Label>
        </div>
        <div className="flex items-center space-x-4">
          <Switch
            id="parking"
            checked={filter.hasParking}
            onCheckedChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                hasParking: !filter.hasParking,
              }))
            }
          />
          <Label htmlFor="parking">Has Parking</Label>
        </div>
        <div className="flex items-center space-x-4">
          <Switch
            id="fence"
            checked={filter.hasFence}
            onCheckedChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                hasFence: !filter.hasFence,
              }))
            }
          />
          <Label htmlFor="fence">Is Fenced</Label>
        </div>
        <div className="flex items-center space-x-4">
          <Switch
            id="balcony"
            checked={filter.hasBalcony}
            onCheckedChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                hasBalcony: !filter.hasBalcony,
              }))
            }
          />
          <Label htmlFor="balcony">Has Balcony</Label>
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={applyFilters}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Apply Filter
        </Button>
        <Button variant={"ghost"} onClick={clearFilters} className="border">
          Reset Form
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;
