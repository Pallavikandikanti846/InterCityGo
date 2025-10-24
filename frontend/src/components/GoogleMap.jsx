import { useEffect, useRef, useState } from "react";

export default function GoogleMap({ 
  height = "280px", 
  showUserLocation = true,
  center = null 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  // Default center (Toronto)
  const defaultCenter = { lat: 43.6532, lng: -79.3832 };

  useEffect(() => {
    // Get user's current location
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setError("Unable to get your location");
        }
      );
    }
  }, [showUserLocation]);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (!window.google || !window.google.maps) {
      setError("Google Maps not loaded");
      return;
    }

    if (!mapRef.current) return;

    // Determine map center
    const mapCenter = center || userLocation || defaultCenter;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: userLocation ? 13 : 11,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Add marker for user location
    if (userLocation || center) {
      const marker = new window.google.maps.Marker({
        position: center || userLocation,
        map: map,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 3,
          scale: 8,
        },
      });
      markerRef.current = marker;
    }

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [userLocation, center]);

  if (error) {
    return (
      <div 
        style={{ 
          height, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%)",
          borderRadius: "0",
          color: "#6B7280",
          fontSize: "14px"
        }}
      >
        Map unavailable
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: "100%", 
        height,
        borderRadius: "0"
      }}
    />
  );
}

