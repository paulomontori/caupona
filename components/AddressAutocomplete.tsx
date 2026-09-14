"use client";

import { useEffect, useRef } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

type Value = { address: string; lat: number; lng: number };

type PlaceAutocompleteElement = HTMLElement & {
  addEventListener(
    type: "gmp-select",
    listener: (event: { placePrediction: { toPlace(): GooglePlace } }) => void
  ): void;
};

type GooglePlace = {
  fetchFields(options: { fields: string[] }): Promise<void>;
  formattedAddress: string | null;
  location: { lat(): number; lng(): number } | null;
};

function AutocompleteInput({ onSelect }: { onSelect: (value: Value) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !containerRef.current) return;

    const PlaceAutocompleteElementCtor = (
      placesLib as unknown as { PlaceAutocompleteElement: new () => PlaceAutocompleteElement }
    ).PlaceAutocompleteElement;
    const element = new PlaceAutocompleteElementCtor();
    element.setAttribute("style", "width: 100%;");
    containerRef.current.appendChild(element);

    const handleSelect = async (event: { placePrediction: { toPlace(): GooglePlace } }) => {
      const place = event.placePrediction.toPlace();
      await place.fetchFields({ fields: ["formattedAddress", "location"] });
      if (place.formattedAddress && place.location) {
        onSelect({
          address: place.formattedAddress,
          lat: place.location.lat(),
          lng: place.location.lng(),
        });
      }
    };

    element.addEventListener("gmp-select", handleSelect);

    return () => {
      containerRef.current?.removeChild(element);
    };
  }, [placesLib, onSelect]);

  return <div ref={containerRef} />;
}

export default function AddressAutocomplete({ onSelect }: { onSelect: (value: Value) => void }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <p className="text-sm text-red-600">
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não configurada.
      </p>
    );
  }

  return (
    <APIProvider apiKey={apiKey} version="beta">
      <AutocompleteInput onSelect={onSelect} />
    </APIProvider>
  );
}
