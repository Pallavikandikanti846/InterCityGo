import { useState, useEffect } from "react";

// Custom hook to manage Google Maps API loading state
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already loaded
    if (window.google && window.google.maps && window.google.maps.Map) {
      setIsLoaded(true);
      return;
    }

    // Check if currently loading
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script is already loading, wait for it
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          setIsLoaded(true);
          setIsLoading(false);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    const getKey = () => {
      if (typeof window !== "undefined") {
        if (window.VITE_GOOGLE_MAPS_API_KEY && String(window.VITE_GOOGLE_MAPS_API_KEY).trim() !== "") {
          return String(window.VITE_GOOGLE_MAPS_API_KEY).trim();
        }
        if (window.__GOOGLE_MAPS_API_KEY__ && String(window.__GOOGLE_MAPS_API_KEY__).trim() !== "") {
          return String(window.__GOOGLE_MAPS_API_KEY__).trim();
        }
      }
      return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    };
    let apiKey = getKey();
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
      (async () => {
        const serverKey = await loadFromServer();
        if (!serverKey) {
          setError("Google Maps API key not found");
          setIsLoading(false);
          return;
        }
        apiKey = serverKey;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          const checkAPI = () => {
            if (window.google && window.google.maps && window.google.maps.Map) {
              setIsLoaded(true);
              setIsLoading(false);
            } else {
              setTimeout(checkAPI, 100);
            }
          };
          checkAPI();
        };
        script.onerror = (error) => {
          console.error("Failed to load Google Maps:", error);
          setError("Failed to load Google Maps");
          setIsLoading(false);
        };
        document.head.appendChild(script);
      })();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait for API to be fully initialized
      const checkAPI = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          setIsLoaded(true);
          setIsLoading(false);
        } else {
          setTimeout(checkAPI, 100);
        }
      };
      checkAPI();
    };

    script.onerror = (error) => {
      console.error("Failed to load Google Maps:", error);
      setError("Failed to load Google Maps");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [isLoading]);

  return { isLoaded, isLoading, error };
};

