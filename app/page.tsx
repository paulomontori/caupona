import Link from "next/link";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { RestaurantWithReviews } from "@/lib/types";
import MapView from "@/components/MapView";
import RestaurantCard from "@/components/RestaurantCard";

async function getRestaurants(): Promise<RestaurantWithReviews[]> {
  const { data: restaurants } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: reviews } = await supabaseAdmin.from("restaurant_reviews").select("*");

  return (restaurants ?? []).map((r) => ({
    ...r,
    reviews: (reviews ?? []).filter((rv) => rv.restaurant_id === r.id),
  }));
}

export default async function Home() {
  const session = await auth();
  const restaurants = await getRestaurants();
  const userEmail = session?.user?.email?.toLowerCase() ?? "";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Restaurantes</h1>
        <Link
          href="/restaurants/new"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          + Adicionar restaurante
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nenhum restaurante ainda. Adicione o primeiro!
        </p>
      ) : (
        <>
          <MapView restaurants={restaurants} userEmail={userEmail} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
