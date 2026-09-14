import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  }

  const { data: reviews, error: reviewsError } = await supabaseAdmin
    .from("restaurant_reviews")
    .select("*")
    .eq("restaurant_id", id);

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }

  return NextResponse.json({ ...restaurant, reviews });
}
