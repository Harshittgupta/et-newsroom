import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchNews } from "@/lib/news";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona") ?? "investor";
  const category = searchParams.get("category") ?? "all";

  try {
    const articles = await fetchNews(persona, category);
    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ articles: [], error: "Failed to fetch news" }, { status: 500 });
  }
}

// Save a bookmark
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { article_id, article_title, article_url, article_category } = await request.json();
  const { error } = await supabase.from("bookmarks").insert({
    user_id: user.id, article_id, article_title, article_url, article_category,
  });

  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// Delete a bookmark
export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { article_id } = await request.json();
  const { error } = await supabase
    .from("bookmarks").delete()
    .eq("user_id", user.id).eq("article_id", article_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
