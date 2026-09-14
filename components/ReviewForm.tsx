"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RestaurantReview } from "@/lib/types";

export default function ReviewForm({
  restaurantId,
  existing,
}: {
  restaurantId: string;
  existing: RestaurantReview | undefined;
}) {
  const router = useRouter();
  const [went, setWent] = useState(existing?.went ?? false);
  const [rating, setRating] = useState<number | "">(existing?.rating ?? "");
  const [impression, setImpression] = useState(existing?.impression ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        went,
        rating: went && rating !== "" ? Number(rating) : null,
        impression: impression || null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Erro ao salvar.");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
        <input
          type="checkbox"
          checked={went}
          onChange={(e) => setWent(e.target.checked)}
          className="h-4 w-4"
        />
        Eu já fui
      </label>

      {went && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Nota (1 a 5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">-</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Minha impressão</label>
            <textarea
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
