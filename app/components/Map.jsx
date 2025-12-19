"use client";

import { useEffect, useRef } from "react";

export default function Map({
  center = { lat: 33.8938, lng: 35.5018 },
  zoom = 12,
  originCoords = null,
  destinationCoords = null,
  width = "100%",
  height = "400px",
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Initialisiere Map einmal
  useEffect(() => {
    if (typeof window === "undefined" || !window.google?.maps) return;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        // (Optional) cleaner Look, ohne Logik: UI etwas reduzieren
        disableDefaultUI: true,
        zoomControl: true,
      });
    }
  }, [center, zoom]);

  // Setze/entferne Marker für Start/Ziel dynamisch
  useEffect(() => {
    const map = mapInstanceRef.current;

    // START-Marker
    if (originCoords && map) {
      if (!originMarkerRef.current) {
        originMarkerRef.current = new window.google.maps.Marker({
          map,
          position: originCoords,
          label: "A",
          title: "Start",
        });
      } else {
        originMarkerRef.current.setPosition(originCoords);
        originMarkerRef.current.setMap(map);
      }
    } else if (originMarkerRef.current) {
      originMarkerRef.current.setMap(null);
    }

    // ZIEL-Marker
    if (destinationCoords && map) {
      if (!destMarkerRef.current) {
        destMarkerRef.current = new window.google.maps.Marker({
          map,
          position: destinationCoords,
          label: "B",
          title: "Ziel",
        });
      } else {
        destMarkerRef.current.setPosition(destinationCoords);
        destMarkerRef.current.setMap(map);
      }
    } else if (destMarkerRef.current) {
      destMarkerRef.current.setMap(null);
    }

    // Cleanup bei Unmount
    return () => {
      if (originMarkerRef.current) originMarkerRef.current.setMap(null);
      if (destMarkerRef.current) destMarkerRef.current.setMap(null);
    };
  }, [originCoords, destinationCoords]);

  // fitBounds-Logik
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (originCoords && destinationCoords) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(originCoords);
      bounds.extend(destinationCoords);
      map.fitBounds(bounds, 100);
    } else if (originCoords) {
      map.setCenter(originCoords);
      map.setZoom(14);
    } else if (destinationCoords) {
      map.setCenter(destinationCoords);
      map.setZoom(14);
    } else {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [originCoords, destinationCoords, center, zoom]);

  // DirectionsRenderer für echte Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (typeof window === "undefined" || !window.google?.maps || !map) return;

    // Falls schon einer existiert, entfernen
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    // Nur wenn beide Koordinaten gesetzt sind
    if (originCoords && destinationCoords) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "var(--amd-primary, #c1272d)", // AMD Rot statt Lila
          strokeOpacity: 0.9,
          strokeWeight: 6,
        },
      });

      directionsRenderer.setMap(map);
      directionsRendererRef.current = directionsRenderer;

      directionsService.route(
        {
          origin: originCoords,
          destination: destinationCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, [originCoords, destinationCoords]);

  return (
    <div
      ref={mapRef}
      style={{ width, height }}
      className="rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden bg-white"
    />
  );
}
