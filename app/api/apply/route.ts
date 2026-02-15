import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";



console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

// Create Supabase client using service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  try {
    // Parse JSON safely
    const body = await req.json();
    const { full_name, email, idea_description } = body ?? {};

    // Basic validation
    if (!full_name || !email || !idea_description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into database
    const { data, error } = await supabase
      .from("application")
      .insert([
        {
          full_name: String(full_name).trim(),
          email: String(email).toLowerCase().trim(),
          idea_description: String(idea_description).trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("Insert success:", data);

    return NextResponse.json({
      success: true,
      inserted: data,
    });
  } catch (err) {
    console.error("Server error:", err);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
