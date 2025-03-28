import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/supabase/seed";

export async function GET() {
  try {
    const result = await seedDatabase();

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to seed database", details: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Error in seed API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
