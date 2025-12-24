import { get } from "http";

import { getHouseById } from "@/app/(shared-layout)/houses/actions";
import { Button } from "@/components/ui/button";
import { fetchHouseForEditAction } from "../../../actions";
import { UpdateHouseForm } from "../../../_components/forms/update-house-form";
import { db } from "@/server/db/drizzle";
import { eq } from "drizzle-orm";
import { divisions, neighborhoods, subdivisions } from "@/server/db/schema";

interface EditHousePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditHousePage = async ({ params }: EditHousePageProps) => {
  const { id } = await params;
  const house = await fetchHouseForEditAction(id);
  console.log(house);

  if ("error" in house) {
    return <div>Error: {house.error}</div>;
  }

  const initialValues = {
    id: house.id,
    title: house.title,
    price: house.price,
    purpose: house.purpose,
    houseTypeId: house.houseTypeId,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    hasInternalToilet: house.hasInternalToilet,
    hasParking: house.hasParking,
    hasWell: house.hasWell,
    hasFence: house.hasFence,
    hasBalcony: house.hasBalcony,
    regionId: house.regionId,
    divisionId: house.divisionId,
    subdivisionId: house.subdivisionId,
    neighborhoodId: house.neighborhoodId,
    location: house.location,
    description: house.description ?? undefined,
  };

  const [
    houseTypeRes,
    regionsRes,
    divisionsRes,
    subdivisionsRes,
    neighborhoodsRes,
  ] = await Promise.all([
    db.query.houseTypes.findMany(),
    db.query.regions.findMany(),
    db.query.divisions.findMany({
      where: eq(divisions.regionId, house.regionId),
    }),
    db.query.subdivisions.findMany({
      where: eq(subdivisions.divisionId, house.divisionId),
    }),
    db.query.neighborhoods.findMany({
      where: eq(neighborhoods.subdivisionId, house.subdivisionId),
    }),
  ]);

  console.log(divisionsRes);
  console.log(subdivisionsRes);
  console.log(neighborhoodsRes);

  return (
    <div className="max-w-3xl mx-auto px-2 pt-8 pb-12 space-y-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold">Update House</h1>
      <UpdateHouseForm
        houseId={house.id}
        initialImages={house.images}
        initialValues={initialValues}
        initialHouseTypes={houseTypeRes}
        initialRegions={regionsRes}
        initialDivisions={divisionsRes}
        initialSubdivisions={subdivisionsRes}
        initialNeighborhoods={neighborhoodsRes}
      />
    </div>
  );
};

export default EditHousePage;
