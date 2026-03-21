import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 60;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, contacted_at, replied_at } = body;

    const supabase = createServerClient();

    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (contacted_at) update.contacted_at = contacted_at;
    if (replied_at) update.replied_at = replied_at;

    const { data, error } = await supabase
      .from("vc_outreach")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update outreach: ${error.message}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update outreach error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update" },
      { status: 500 }
    );
  }
}
