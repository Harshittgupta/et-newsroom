import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/profile — fetch current user's profile + watchlist + bookmarks
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profileRes, watchlistRes, bookmarksRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("watchlist").select("*").eq("user_id", user.id).order("added_at"),
    supabase.from("bookmarks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    profile: profileRes.data,
    watchlist: watchlistRes.data ?? [],
    bookmarks: bookmarksRes.data ?? [],
  });
}

// PATCH /api/profile — update persona or interests
export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowed = ["persona", "interests", "full_name"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
