CREATE TABLE "accommodations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"address" text NOT NULL,
	"area" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"postal_code" text NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"monthly_rent" numeric(10, 2) NOT NULL,
	"deposit" numeric(10, 2),
	"utilities_included" boolean DEFAULT false,
	"utilities_cost" numeric(10, 2),
	"accommodation_type" text NOT NULL,
	"total_rooms" integer NOT NULL,
	"available_rooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"furnished" boolean DEFAULT false,
	"has_wifi" boolean DEFAULT false,
	"has_parking" boolean DEFAULT false,
	"pets_allowed" boolean DEFAULT false,
	"has_laundry" boolean DEFAULT false,
	"has_kitchen" boolean DEFAULT false,
	"has_security" boolean DEFAULT false,
	"has_backup_power" boolean DEFAULT false,
	"images" text[] DEFAULT '{}',
	"amenities" text[] DEFAULT '{}',
	"nearby_universities" text[] DEFAULT '{}',
	"distance_to_universities" json,
	"transport_links" text[] DEFAULT '{}',
	"walking_distance" text[] DEFAULT '{}',
	"house_rules" text[] DEFAULT '{}',
	"minimum_stay_months" integer DEFAULT 6,
	"maximum_occupants" integer,
	"preferred_tenant_type" text,
	"gender_preference" text,
	"is_shared" boolean DEFAULT false,
	"rent_split_enabled" boolean DEFAULT false,
	"rent_per_person" numeric(10, 2),
	"landlord_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"accommodation_id" integer NOT NULL,
	"applicant_id" integer NOT NULL,
	"message" text NOT NULL,
	"preferred_move_in_date" timestamp NOT NULL,
	"budget_range" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"viewed_by_landlord" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"accommodation_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"accommodation_id" integer,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental_agreements" (
	"id" serial PRIMARY KEY NOT NULL,
	"accommodation_id" integer NOT NULL,
	"total_monthly_rent" numeric(10, 2) NOT NULL,
	"deposit" numeric(10, 2),
	"lease_start_date" timestamp NOT NULL,
	"lease_end_date" timestamp NOT NULL,
	"payment_due_date" integer NOT NULL,
	"payment_split_method" text NOT NULL,
	"utilities" text[] DEFAULT '{}',
	"landlord_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"accommodation_id" integer NOT NULL,
	"reviewer_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"cleanliness" integer,
	"location" integer,
	"value" integer,
	"communication" integer,
	"comment" text,
	"images" text[] DEFAULT '{}',
	"is_verified_stay" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roommate_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"accommodation_id" integer NOT NULL,
	"requester_id" integer NOT NULL,
	"target_user_id" integer NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"compatibility_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "roommates" (
	"id" serial PRIMARY KEY NOT NULL,
	"accommodation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"move_in_date" timestamp NOT NULL,
	"move_out_date" timestamp,
	"monthly_share" numeric(10, 2) NOT NULL,
	"is_current_resident" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"reviewed_user_id" integer NOT NULL,
	"reviewer_id" integer NOT NULL,
	"accommodation_id" integer,
	"rating" integer NOT NULL,
	"cleanliness" integer,
	"communication" integer,
	"respectfulness" integer,
	"reliability" integer,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"user_type" text NOT NULL,
	"university" text,
	"study_field" text,
	"year_of_study" integer,
	"student_id" text,
	"profile_image" text,
	"bio" text,
	"date_of_birth" timestamp,
	"gender" text,
	"nationality" text,
	"lifestyle" text[] DEFAULT '{}',
	"preferences" text[] DEFAULT '{}',
	"hobbies" text[] DEFAULT '{}',
	"dietary_restrictions" text[] DEFAULT '{}',
	"sleep_schedule" text,
	"cleanliness_level" integer DEFAULT 5,
	"noise_level" integer DEFAULT 5,
	"guest_policy" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"verification_documents" text[] DEFAULT '{}',
	"emergency_contact_name" text,
	"emergency_contact_phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_landlord_id_users_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_agreements" ADD CONSTRAINT "rental_agreements_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_agreements" ADD CONSTRAINT "rental_agreements_landlord_id_users_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roommate_requests" ADD CONSTRAINT "roommate_requests_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roommate_requests" ADD CONSTRAINT "roommate_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roommate_requests" ADD CONSTRAINT "roommate_requests_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roommates" ADD CONSTRAINT "roommates_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roommates" ADD CONSTRAINT "roommates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_reviewed_user_id_users_id_fk" FOREIGN KEY ("reviewed_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_accommodation_id_accommodations_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodations"("id") ON DELETE no action ON UPDATE no action;