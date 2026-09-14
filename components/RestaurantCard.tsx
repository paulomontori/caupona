import Link from "next/link";
import type { RestaurantWithReviews } from "@/lib/types";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantWithReviews;
}) {
  const wentReviews = restaurant.reviews.filter((r) => r.went && r.rating !== null);
  const avgRating =
    wentReviews.length > 0
      ? (wentReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / wentReviews.length).toFixed(1)
      : null;
  const visitedCount = restaurant.reviews.filter((r) => r.went).length;

  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="block rounded-lg border border-zinc-200 p-4 transition hover:border-orange-400 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-zinc-900">{restaurant.name}</h3>
        {avgRating && (
          <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
            ★ {avgRating}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-zinc-500">{restaurant.cuisine_style}</p>
      <p className="mt-1 text-sm text-zinc-500">{restaurant.address}</p>
      <p className="mt-2 text-xs text-zinc-400">
        {visitedCount > 0
          ? `${visitedCount} amigo(s) já foram`
          : "Ninguém foi ainda"}
      </p>
    </Link>
  );
}
