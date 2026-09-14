"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressAutocomplete from "./AddressAutocomplete";

export default function RestaurantForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cuisineStyle, setCuisineStyle] = useState("");
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState<{ address: string; lat: number; lng: number } | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location) {
      setError("Selecione um endereço da lista de sugestões.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        cuisine_style: cuisineStyle,
        reason,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Erro ao salvar o restaurante.");
      return;
    }

    const created = await res.json();
    router.push(`/restaurants/${created.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Endereço</label>
        <AddressAutocomplete onSelect={setLocation} />
        {location && <p className="mt-1 text-xs text-zinc-500">{location.address}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Estilo de comida</label>
        <input
          value={cuisineStyle}
          onChange={(e) => setCuisineStyle(e.target.value)}
          placeholder="ex: japonesa, hambúrguer, italiana..."
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Por que adicionar esse lugar?
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={3}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {submitting ? "Salvando..." : "Adicionar restaurante"}
      </button>
    </form>
  );
}
