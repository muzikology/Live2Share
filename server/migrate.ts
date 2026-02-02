import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/live2share";

async function runMigration() {
  console.log("⏳ Running migrations...");
  
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);
  
  await migrate(db, { migrationsFolder: "./migrations" });
  
  console.log("✅ Migrations completed!");
  
  await migrationClient.end();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("❌ Migration failed!");
  console.error(err);
  process.exit(1);
});
