import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("content_assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { format, theme, title, html_content } = body;
    if (!format || !theme || !title || !html_content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("content_assets")
      .insert({ format, theme, title, html_content })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
