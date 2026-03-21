import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contact_id,
      context,
    }: { contact_id: string; context?: string } = body;

    if (!contact_id) {
      return NextResponse.json(
        { error: "contact_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch contact + firm
    const { data: contact, error: contactError } = await supabase
      .from("vc_contacts")
      .select("*, vc_firms(*)")
      .eq("id", contact_id)
      .single();

    if (contactError || !contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    const firm = contact.vc_firms;
    const focusAreas = firm?.focus_areas?.join(", ") || "not specified";

    const client = new Anthropic();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: "You are writing a LinkedIn DM from a founder to a VC. Be direct, specific, and human. No fluff. Max 300 characters. Reference something specific about their role or firm focus if available. The sender builds Ultron — an AI operating system for founder-led businesses that replaces manual ops with AI agents (sales, content, outreach, research). Focus: why this VC should care now.",
      messages: [
        {
          role: "user",
          content: `Write a DM to ${contact.full_name}, ${contact.title} at ${firm?.name || "their firm"}. Firm focus: ${focusAreas}. Their recent post: ${contact.last_post_content || "none available"}.${context ? ` Additional context: ${context}` : ""} Keep it under 300 chars.`,
        },
      ],
    });

    const dmText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();

    // Save to vc_outreach
    const { data: outreach, error: outreachError } = await supabase
      .from("vc_outreach")
      .upsert(
        {
          contact_id,
          dm_text: dmText,
          dm_generated_at: new Date().toISOString(),
          status: "to_contact",
        },
        { onConflict: "contact_id" }
      )
      .select()
      .single();

    if (outreachError) throw new Error(`Failed to save outreach: ${outreachError.message}`);

    return NextResponse.json({
      dm_text: dmText,
      outreach_id: outreach.id,
    });
  } catch (error) {
    console.error("Generate DM error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate DM" },
      { status: 500 }
    );
  }
}
