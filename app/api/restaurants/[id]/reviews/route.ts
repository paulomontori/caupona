import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id: restaurant_id } = await params;
  const body = await request.json();
  const { went, rating, impression } = body;

  if (typeof went !== "boolean") {
    return NextResponse.json({ error: "'went' é obrigatório" }, { status: 400 });
  }
  if (rating !== null && rating !== undefined && (rating < 1 || rating > 5)) {
    return NextResponse.json({ error: "nota deve ser entre 1 e 5" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("restaurant_reviews")
    .upsert(
      {
        restaurant_id,
        user_email: session.user.email.toLowerCase(),
        went,
        rating: rating ?? null,
        impression: impression ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "restaurant_id,user_email" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
