import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    // Delete in order: ideas -> analyses -> posts -> profile
    await supabase.from("content_ideas").delete().eq("profile_id", id);
    await supabase.from("content_analyses").delete().eq("profile_id", id);
    await supabase.from("posts").delete().eq("profile_id", id);

    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete profile error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete profile" },
      { status: 500 }
    );
  }
}
