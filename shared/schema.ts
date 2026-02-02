import { pgTable, text, serial, integer, decimal, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(), // 'tenant', 'landlord', 'both'
  
  // Student/Tenant specific fields
  university: text("university"),
  studyField: text("study_field"),
  yearOfStudy: integer("year_of_study"),
  studentId: text("student_id"),
  
  // Profile fields
  profileImage: text("profile_image"),
  bio: text("bio"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  nationality: text("nationality"),
  
  // Lifestyle & Preferences for roommate matching
  lifestyle: text("lifestyle").array().default([]), // quiet, social, partying, early_riser, night_owl, studious, active
  preferences: text("preferences").array().default([]), // non_smoking, pet_friendly, clean, organized, flexible
  hobbies: text("hobbies").array().default([]),
  dietaryRestrictions: text("dietary_restrictions").array().default([]),
  sleepSchedule: text("sleep_schedule"), // early, normal, late
  cleanlinessLevel: integer("cleanliness_level").default(5), // 1-10 scale
  noiseLevel: integer("noise_level").default(5), // 1-10 scale
  guestPolicy: text("guest_policy"), // no_guests, occasional, frequent
  
  // Verification & Security
  isVerified: boolean("is_verified").default(false).notNull(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
  verificationDocuments: text("verification_documents").array().default([]),
  
  // Emergency contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  
  // Pricing
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }),
  utilitiesIncluded: boolean("utilities_included").default(false),
  utilitiesCost: decimal("utilities_cost", { precision: 10, scale: 2 }),
  
  // Property details
  accommodationType: text("accommodation_type").notNull(), // house, apartment, flat, commune, backyard_room, student_res
  totalRooms: integer("total_rooms").notNull(),
  availableRooms: integer("available_rooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  furnished: boolean("furnished").default(false),
  
  // Amenities
  hasWifi: boolean("has_wifi").default(false),
  hasParking: boolean("has_parking").default(false),
  petsAllowed: boolean("pets_allowed").default(false),
  hasLaundry: boolean("has_laundry").default(false),
  hasKitchen: boolean("has_kitchen").default(false),
  hasSecurity: boolean("has_security").default(false),
  hasBackupPower: boolean("has_backup_power").default(false),
  
  images: text("images").array().default([]),
  amenities: text("amenities").array().default([]),
  
  // Location & Transport
  nearbyUniversities: text("nearby_universities").array().default([]),
  distanceToUniversities: json("distance_to_universities").$type<Record<string, number>>(), // {university: distance_in_km}
  transportLinks: text("transport_links").array().default([]),
  walkingDistance: text("walking_distance").array().default([]),
  
  // Rules & Requirements
  houseRules: text("house_rules").array().default([]),
  minimumStayMonths: integer("minimum_stay_months").default(6),
  maximumOccupants: integer("maximum_occupants"),
  preferredTenantType: text("preferred_tenant_type"), // student, professional, any
  genderPreference: text("gender_preference"), // male, female, any
  
  // Sharing & Rent Split
  isShared: boolean("is_shared").default(false),
  rentSplitEnabled: boolean("rent_split_enabled").default(false),
  rentPerPerson: decimal("rent_per_person", { precision: 10, scale: 2 }),
  
  landlordId: integer("landlord_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  viewCount: integer("view_count").default(0),
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
  status: text("status").default("pending").notNull(), // pending, approved, rejected, cancelled
  rejectionReason: text("rejection_reason"),
  viewedByLandlord: boolean("viewed_by_landlord").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Roommate matching and requests
export const roommateRequests = pgTable("roommate_requests", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id).notNull(),
  requesterId: integer("requester_id").references(() => users.id).notNull(),
  targetUserId: integer("target_user_id").references(() => users.id).notNull(),
  message: text("message"),
  status: text("status").default("pending").notNull(), // pending, accepted, rejected
  compatibilityScore: integer("compatibility_score"), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
});

// Messages between users
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  cleanliness: integer("cleanliness"),
  location: integer("location"),
  value: integer("value"),
  communication: integer("communication"),
  comment: text("comment"),
  images: text("images").array().default([]),
  isVerifiedStay: boolean("is_verified_stay").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User reviews (roommate/tenant reviews)
export const userReviews = pgTable("user_reviews", {
  id: serial("id").primaryKey(),
  reviewedUserId: integer("reviewed_user_id").references(() => users.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id),
  rating: integer("rating").notNull(), // 1-5
  cleanliness: integer("cleanliness"),
  communication: integer("communication"),
  respectfulness: integer("respectfulness"),
  reliability: integer("reliability"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Favorites/Saved properties
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  accommodationId: integer("accommodation_id").references(() => accommodations.id).notNull(),
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
  updatedAt: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertRoommateSchema = createInsertSchema(roommates).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewedByLandlord: true,
});

export const insertRentalAgreementSchema = createInsertSchema(rentalAgreements).omit({
  id: true,
  createdAt: true,
});

export const insertRoommateRequestSchema = createInsertSchema(roommateRequests).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertUserReviewSchema = createInsertSchema(userReviews).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
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

export type InsertRoommateRequest = z.infer<typeof insertRoommateRequestSchema>;
export type RoommateRequest = typeof roommateRequests.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertUserReview = z.infer<typeof insertUserReviewSchema>;
export type UserReview = typeof userReviews.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

