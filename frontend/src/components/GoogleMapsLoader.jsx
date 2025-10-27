import { useEffect, useState } from "react";
import { testGoogleMapsAPI, checkAPIKeyConfig, getTroubleshootingSteps } from "../utils/googleMapsTest";
import { testAPIKeyDirectly, testCurrentDomain } from "../utils/apiKeyTest";

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

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script is already loading or loaded, wait for it
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Load Google Maps script with proper loading pattern
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait a bit for the API to fully initialize
      const checkAPI = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          // Test the API after loading
          checkAPIKeyConfig();
          testCurrentDomain();
          testAPIKeyDirectly();
          testGoogleMapsAPI();
          setIsLoaded(true);
        } else {
          // Keep checking until API is ready
          setTimeout(checkAPI, 100);
        }
      };
      checkAPI();
    };

    script.onerror = (error) => {
      console.error("Failed to load Google Maps:", error);
      checkAPIKeyConfig();
      getTroubleshootingSteps();
      setError("Failed to load Google Maps. Check console for troubleshooting steps.");
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

