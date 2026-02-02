import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// For development, use a local PostgreSQL database
// For production, use the DATABASE_URL environment variable
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/live2share";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
