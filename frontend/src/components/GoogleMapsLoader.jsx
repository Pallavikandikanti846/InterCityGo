import { useEffect, useState } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export default function GoogleMapsLoader({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if API key is provided
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key not found. Using manual input mode.");
      setIsLoaded(true); // Allow app to work without Google Maps
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError("Failed to load Google Maps");
      setIsLoaded(true); // Still render app, just without autocomplete
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (error) {
    console.error(error);
  }

  // Always render children (app works with or without Google Maps)
  return <>{children}</>;
}

