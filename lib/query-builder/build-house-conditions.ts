import { houses } from "@/server/db/schema";
import { eq, gt, lt } from "drizzle-orm";

export function buildHouseConditions(params: Record<string, any>) {
  const conditions: any[] = [];

  /* 🏠 Simple filters */
  if (params.houseType) {
    conditions.push(eq(houses.houseTypeId, params.houseType));
  }

  if (params.purpose) {
    conditions.push(eq(houses.purpose, params.purpose));
  }

  if (params.minPrice) {
    conditions.push(gt(houses.price, params.minPrice));
  }

  if (params.maxPrice) {
    conditions.push(lt(houses.price, params.maxPrice));
  }

  if (params.region) {
    conditions.push(eq(houses.regionId, params.region));
  }

  if (params.division) {
    conditions.push(eq(houses.divisionId, params.division));
  }

  if (params.subdivision) {
    conditions.push(eq(houses.subdivisionId, params.subdivision));
  }

  if (params.neighbourhood) {
    conditions.push(eq(houses.neighborhoodId, params.neighbourhood));
  }

  if (params.hasInternalToilet) {
    conditions.push(eq(houses.hasInternalToilet, true));
  }

  if (params.hasWell) {
    conditions.push(eq(houses.hasWell, true));
  }

  if (params.hasBalcony) {
    conditions.push(eq(houses.hasBalcony, true));
  }
  if (params.hasParking) {
    conditions.push(eq(houses.hasParking, true));
  }
  if (params.hasFence) {
    conditions.push(eq(houses.hasFence, true));
  }

  return conditions;
}
