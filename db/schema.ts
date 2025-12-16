import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  primaryKey,
  doublePrecision,
  integer,
} from "drizzle-orm/pg-core";

export const houseStatusEnum = pgEnum("house_status", [
  "AVAILABLE",
  "PENDING",
  "SOLD",
  "RENTED",
]);

export const housePurposeEnum = pgEnum("house_purpose", [
  "FOR_RENT",
  "FOR_SALE",
  "SHORT_STAY",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const role = pgTable("role", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const userRole = pgTable(
  "user_role",
  {
    userId: uuid("user_id").notNull(),
    roleId: uuid("role_id").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const roleInviteToken = pgTable("role_invite_token", {
  id: uuid("id").defaultRandom().primaryKey(),

  token: text("token").notNull().unique(),
  createdBy: uuid("created_by").notNull(),

  targetEmail: text("target_email").notNull(),
  role: text("role").notNull(), // landlord for now

  used: boolean("used").notNull().default(false),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const region = pgTable("region", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

export const division = pgTable("division", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  regionId: uuid("region_id").notNull(),
});

export const subdivision = pgTable("subdivision", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  divisionId: uuid("division_id").notNull(),
});

export const neighborhood = pgTable("neighborhood", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  subdivisionId: uuid("subdivision_id").notNull(),
});

export const houseType = pgTable("house_type", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const house = pgTable("house", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),
  description: text("description"),

  price: doublePrecision("price").notNull(),
  location: text("location").notNull(),

  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),

  hasInternalToilet: boolean("has_internal_toilet").default(false).notNull(),
  hasParking: boolean("has_parking").default(false).notNull(),
  hasWell: boolean("has_well").default(false).notNull(),
  hasFence: boolean("has_fence").default(false).notNull(),
  hasBalcony: boolean("has_balcony").default(false).notNull(),

  purpose: housePurposeEnum("purpose").default("FOR_RENT").notNull(),
  status: houseStatusEnum("status").default("AVAILABLE").notNull(),

  agentId: uuid("agent_id").notNull(),
  houseTypeId: uuid("house_type_id").notNull(),

  regionId: uuid("region_id").notNull(),
  divisionId: uuid("division_id").notNull(),
  subdivisionId: uuid("subdivision_id").notNull(),
  neighborhoodId: uuid("neighborhood_id").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),

  houseId: uuid("house_id").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const houseRelations = relations(house, ({ one, many }) => ({
  agent: one(user, {
    fields: [house.agentId],
    references: [user.id],
  }),
  houseType: one(houseType, {
    fields: [house.houseTypeId],
    references: [houseType.id],
  }),
  region: one(region, {
    fields: [house.regionId],
    references: [region.id],
  }),
  division: one(division, {
    fields: [house.divisionId],
    references: [division.id],
  }),
  subdivision: one(subdivision, {
    fields: [house.subdivisionId],
    references: [subdivision.id],
  }),
  neighborhood: one(neighborhood, {
    fields: [house.neighborhoodId],
    references: [neighborhood.id],
  }),
  images: many(media),
}));

export const userRelation = relations(user, ({ many }) => ({
  roles: many(userRole),
  houses: many(house),
}));

export const schema = {
  user,
  account,
  session,
  verification,
  houseType,
  region,
  division,
  subdivision,
  neighborhood,
};
