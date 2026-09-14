"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import Link from "next/link";
import type { RestaurantWithReviews } from "@/lib/types";

const DEFAULT_CENTER = { lat: -23.5505, lng: -46.6333 }; // São Paulo, ajustável

export default function MapView({
  restaurants,
  userEmail,
}: {
  restaurants: RestaurantWithReviews[];
  userEmail: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
        Mapa indisponível: configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
      </div>
    );
  }

  const selected = restaurants.find((r) => r.id === selectedId) ?? null;
  const center = restaurants[0]
    ? { lat: restaurants[0].lat, lng: restaurants[0].lng }
    : DEFAULT_CENTER;

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[420px] w-full overflow-hidden rounded-lg border border-zinc-200">
        <Map
          mapId="caupona-map"
          defaultCenter={center}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {restaurants.map((r) => {
            const meWent = r.reviews.some((rv) => rv.user_email === userEmail && rv.went);
            return (
              <AdvancedMarker
                key={r.id}
                position={{ lat: r.lat, lng: r.lng }}
                onClick={() => setSelectedId(r.id)}
              >
                <Pin
                  background={meWent ? "#16a34a" : "#ea580c"}
                  borderColor="#ffffff"
                  glyphColor="#ffffff"
                />
              </AdvancedMarker>
            );
          })}

          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelectedId(null)}
            >
              <div className="max-w-[220px] text-sm">
                <p className="font-semibold">{selected.name}</p>
                <p className="text-zinc-600">{selected.cuisine_style}</p>
                <Link
                  href={`/restaurants/${selected.id}`}
                  className="mt-1 inline-block text-orange-700 underline"
                >
                  Ver detalhes
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
