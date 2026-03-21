import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 60;

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: firms, error } = await supabase
      .from("vc_firms")
      .select("*, vc_contacts(id)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch firms: ${error.message}`);

    // Add contact_count
    const firmsWithCount = (firms || []).map((firm) => ({
      ...firm,
      contact_count: (firm.vc_contacts as { id: string }[])?.length || 0,
      vc_contacts: undefined,
    }));

    return NextResponse.json(firmsWithCount);
  } catch (error) {
    console.error("Fetch firms error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch firms" },
      { status: 500 }
    );
  }
}
