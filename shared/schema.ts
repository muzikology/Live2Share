import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  university: text("university").notNull(),
  studyField: text("study_field").notNull(),
  yearOfStudy: integer("year_of_study").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  lifestyle: text("lifestyle").array().default([]), // quiet, social, partying, early_riser, night_owl, etc.
  preferences: text("preferences").array().default([]), // non_smoking, pet_friendly, clean, etc.
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  area: text("area").notNull(), // suburb/township name
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }),
  accommodationType: text("accommodation_type").notNull(), // house, apartment, flat, commune, backyard_room
  totalRooms: integer("total_rooms").notNull(),
  availableRooms: integer("available_rooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  hasWifi: boolean("has_wifi").default(false),
  hasParking: boolean("has_parking").default(false),
  petsAllowed: boolean("pets_allowed").default(false),
  images: text("images").array().default([]),
  amenities: text("amenities").array().default([]),
  nearbyUniversities: text("nearby_universities").array().default([]),
  transportLinks: text("transport_links").array().default([]),
  houseRules: text("house_rules").array().default([]),
  landlordId: integer("landlord_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roommates = pgTable("roommates", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  moveInDate: timestamp("move_in_date").notNull(),
  moveOutDate: timestamp("move_out_date"),
  monthlyShare: decimal("monthly_share", { precision: 10, scale: 2 }).notNull(),
  isCurrentResident: boolean("is_current_resident").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id).notNull(),
  applicantId: integer("applicant_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  preferredMoveInDate: timestamp("preferred_move_in_date").notNull(),
  budgetRange: text("budget_range").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rentalAgreements = pgTable("rental_agreements", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id).notNull(),
  totalMonthlyRent: decimal("total_monthly_rent", { precision: 10, scale: 2 }).notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }),
  leaseStartDate: timestamp("lease_start_date").notNull(),
  leaseEndDate: timestamp("lease_end_date").notNull(),
  paymentDueDate: integer("payment_due_date").notNull(), // day of month
  paymentSplitMethod: text("payment_split_method").notNull(), // equal, custom
  utilities: text("utilities").array().default([]), // electricity, water, gas, internet
  landlordId: integer("landlord_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoommateSchema = createInsertSchema(roommates).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertRentalAgreementSchema = createInsertSchema(rentalAgreements).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;

export type InsertRoommate = z.infer<typeof insertRoommateSchema>;
export type Roommate = typeof roommates.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertRentalAgreement = z.infer<typeof insertRentalAgreementSchema>;
export type RentalAgreement = typeof rentalAgreements.$inferSelect;
