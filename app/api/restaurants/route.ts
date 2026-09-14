import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: restaurants, error: restaurantsError } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (restaurantsError) {
    return NextResponse.json({ error: restaurantsError.message }, { status: 500 });
  }

  const { data: reviews, error: reviewsError } = await supabaseAdmin
    .from("restaurant_reviews")
    .select("*");

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }

  const withReviews = restaurants.map((r) => ({
    ...r,
    reviews: reviews.filter((rv) => rv.restaurant_id === r.id),
  }));

  return NextResponse.json(withReviews);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, address, lat, lng, cuisine_style, reason } = body;

  if (!name || !address || typeof lat !== "number" || typeof lng !== "number" || !cuisine_style || !reason) {
    return NextResponse.json({ error: "campos obrigatórios faltando" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .insert({
      name,
      address,
      lat,
      lng,
      cuisine_style,
      reason,
      added_by_email: session.user.email.toLowerCase(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
