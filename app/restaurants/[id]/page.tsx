import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { RestaurantWithReviews } from "@/lib/types";
import MapView from "@/components/MapView";
import ReviewForm from "@/components/ReviewForm";

async function getRestaurant(id: string): Promise<RestaurantWithReviews | null> {
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (!restaurant) return null;

  const { data: reviews } = await supabaseAdmin
    .from("restaurant_reviews")
    .select("*")
    .eq("restaurant_id", id);

  return { ...restaurant, reviews: reviews ?? [] };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase() ?? "";

  const restaurant = await getRestaurant(id);
  if (!restaurant) notFound();

  const myReview = restaurant.reviews.find((r) => r.user_email === userEmail);
  const otherReviews = restaurant.reviews.filter((r) => r.user_email !== userEmail);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{restaurant.name}</h1>
        <p className="mt-1 text-sm text-zinc-500">{restaurant.cuisine_style}</p>
        <p className="mt-1 text-sm text-zinc-500">{restaurant.address}</p>
        <p className="mt-3 text-sm text-zinc-700">
          <span className="font-medium">Motivo de ter entrado na lista:</span> {restaurant.reason}
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Adicionado por {restaurant.added_by_email} em{" "}
          {new Date(restaurant.created_at).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <MapView restaurants={[restaurant]} userEmail={userEmail} />

      <div>
        <h2 className="mb-2 text-lg font-semibold text-zinc-900">Sua avaliação</h2>
        <ReviewForm restaurantId={restaurant.id} existing={myReview} />
      </div>

      {otherReviews.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Impressões dos amigos</h2>
          <ul className="flex flex-col gap-3">
            {otherReviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-zinc-200 p-3 text-sm">
                <p className="font-medium text-zinc-800">
                  {r.user_email} {r.went ? "— foi" : "— ainda não foi"}
                  {r.went && r.rating ? ` · ★ ${r.rating}` : ""}
                </p>
                {r.impression && <p className="mt-1 text-zinc-600">{r.impression}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
