import { useEffect, useState } from "react";
import { testGoogleMapsAPI, checkAPIKeyConfig, getTroubleshootingSteps } from "../utils/googleMapsTest";
import { testAPIKeyDirectly, testCurrentDomain } from "../utils/apiKeyTest";

const getGoogleMapsApiKey = () => {
  if (typeof window !== "undefined") {
    if (window.VITE_GOOGLE_MAPS_API_KEY && String(window.VITE_GOOGLE_MAPS_API_KEY).trim() !== "") {
      return String(window.VITE_GOOGLE_MAPS_API_KEY).trim();
    }
    if (window.__GOOGLE_MAPS_API_KEY__ && String(window.__GOOGLE_MAPS_API_KEY__).trim() !== "") {
      return String(window.__GOOGLE_MAPS_API_KEY__).trim();
    }
  }
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
};

export default function GoogleMapsLoader({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    let apiKey = getGoogleMapsApiKey();
    const loadFromServer = async () => {
      try {
        const res = await fetch("/api/config/maps-key");
        if (res.ok) {
          const data = await res.json();
          if (data && data.mapsApiKey) {
            return data.mapsApiKey;
          }
        }
      } catch (e) {}
      return "";
    };

    if (!apiKey) {
      // Try backend to read root .env
      // eslint-disable-next-line no-async-promise-executor
      const resolveKey = async () => {
        const k = await loadFromServer();
        if (!k) {
          console.warn("Google Maps API key not found. Using manual input mode.");
          setIsLoaded(true);
          return null;
        }
        return k;
      };
      // Using async IIFE since useEffect can't be async
      (async () => {
        const serverKey = await resolveKey();
        if (!serverKey) return;
        apiKey = serverKey;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          const checkAPI = () => {
            if (window.google && window.google.maps && window.google.maps.Map) {
              checkAPIKeyConfig();
              testCurrentDomain();
              testAPIKeyDirectly();
              testGoogleMapsAPI();
              setIsLoaded(true);
            } else {
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
          setIsLoaded(true);
        };
        document.head.appendChild(script);
      })();
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`;
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

