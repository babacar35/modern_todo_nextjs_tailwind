import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export async function seedDatabase() {
  try {
    // Create Supabase client with service key for admin privileges
    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_KEY || "",
    );

    // Read the seed SQL file
    const seedFilePath = path.join(process.cwd(), "supabase", "seed.sql");
    const seedSql = fs.readFileSync(seedFilePath, "utf8");

    // Execute the SQL directly using supabase.sql() which is more reliable
    console.log("Executing seed SQL directly...");
    const { error } = await supabase.sql(seedSql);

    if (error) {
      console.error("Error seeding database:", error);
      return { success: false, error };
    }

    console.log("Database seeded successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error in seed process:", error);
    return { success: false, error };
  }
}
