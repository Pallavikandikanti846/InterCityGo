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

    // Load Google Maps script
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Google Maps API key not found");
      setIsLoading(false);
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

