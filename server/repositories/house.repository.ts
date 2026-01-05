import { db } from "../db/drizzle";
import { houses } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { HouseStatus, HouseUpdateInput } from "@/types";

type Tx = typeof db extends { transaction(cb: (tx: infer T) => any): any }
  ? T
  : typeof db;

export const HouseRepository = {
  async create(data: any, tx?: Tx) {
    const executor: any = tx ?? db;
    const house = await executor.insert(houses).values(data).returning();
    return house;
  },

  async findMany(conditions: any[], limit: number, skip: number) {
    return db.query.houses.findMany({
      with: {
        images: {
          columns: {
            id: true,
            url: true,
          },
        },
      },
      where: conditions.length > 0 ? and(...conditions) : undefined,
      limit: limit,
      offset: skip,
      orderBy: [desc(houses.createdAt)],
    });
  },

  async countWithConditions(conditions: any[]) {
    return db.$count(houses, ...conditions);
  },

  async findById(id: string) {
    return db.query.houses.findFirst({
      where: eq(houses.id, id),
    });
  },

  async findByIdWithImages(id: string) {
    return db.query.houses.findFirst({
      where: eq(houses.id, id),
      with: {
        images: true,
        agent: { with: { profile: true } },
        region: true,
        division: true,
        subdivision: true,
        neighborhood: true,
        houseType: true,
      },
    });
  },

  async update(houseId: string, ownerId: string, data: HouseUpdateInput) {
    return db
      .update(houses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(houses.id, houseId), eq(houses.agentId, ownerId)))
      .returning();
  },

  async delete(houseId: string, ownerId: string) {
    return db
      .delete(houses)
      .where(and(eq(houses.id, houseId), eq(houses.agentId, ownerId)))
      .returning();
  },

  async changeStatus(houseId: string, ownerId: string, status: HouseStatus) {
    return db
      .update(houses)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(houses.id, houseId), eq(houses.agentId, ownerId)))
      .returning();
  },
};
