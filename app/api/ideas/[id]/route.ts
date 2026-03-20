import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { IdeaStatus } from "@/lib/database.types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status }: { status: IdeaStatus } = body;

    if (!status || !["idea", "writing", "done", "skipped"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required (idea, writing, done, skipped)" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("content_ideas")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update idea: ${error.message}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Idea update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update idea" },
      { status: 500 }
    );
  }
}
