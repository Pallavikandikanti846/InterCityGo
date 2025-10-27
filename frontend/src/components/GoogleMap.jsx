import { useEffect, useRef, useState } from "react";
import MapFallback from "./MapFallback";
import { useGoogleMaps } from "../hooks/useGoogleMaps";

// Helper function to create marker content for AdvancedMarkerElement
const createMarkerContent = (color) => {
  const markerElement = document.createElement("div");
  markerElement.style.width = "16px";
  markerElement.style.height = "16px";
  markerElement.style.borderRadius = "50%";
  markerElement.style.backgroundColor = color;
  markerElement.style.border = "3px solid #FFFFFF";
  markerElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  return markerElement;
};

export default function GoogleMap({ 
  height = "280px", 
  showUserLocation = true,
  center = null 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapError, setMapError] = useState(null);
  const { isLoaded, isLoading, error: apiError } = useGoogleMaps();

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
    // Only initialize map when Google Maps is loaded
    if (!isLoaded) return;

    if (!mapRef.current) return;

    // Determine map center
    const mapCenter = center || userLocation || defaultCenter;

    try {
      // Validate that Map constructor is available
      if (typeof window.google.maps.Map !== 'function') {
        throw new Error("Google Maps Map constructor not available");
      }

      // Initialize map with Map ID for Advanced Markers support
      const mapOptions = {
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
      };

      // Add Map ID if available (needed for Advanced Markers)
      const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
      if (mapId) {
        mapOptions.mapId = mapId;
      }

      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      mapInstanceRef.current = map;

      // Add marker for user location using AdvancedMarkerElement if available
      if (userLocation || center) {
        try {
          // Check if AdvancedMarkerElement is available and Map ID is present
          const hasAdvancedMarkers = window.google.maps.marker && 
                                   window.google.maps.marker.AdvancedMarkerElement &&
                                   mapId;
          
          if (hasAdvancedMarkers) {
            // Use the new AdvancedMarkerElement
            const marker = new window.google.maps.marker.AdvancedMarkerElement({
              position: center || userLocation,
              map: map,
              title: "Your Location",
              content: createMarkerContent("#3B82F6"),
            });
            markerRef.current = marker;
          } else {
            // Fallback to old Marker
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
        } catch (markerError) {
          console.warn("Error creating marker:", markerError);
          // Skip marker creation if there are API issues
        }
      }
    } catch (mapError) {
      console.error("Error initializing map:", mapError);
      setMapError("Failed to initialize map. Check API key restrictions.");
      return;
    }

    // Cleanup
    return () => {
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
        } catch (cleanupError) {
          console.warn("Error during marker cleanup:", cleanupError);
        }
      }
    };
  }, [isLoaded, userLocation, center]);

  // Show loading state
  if (isLoading) {
    return (
      <div 
        style={{ 
          height, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%)",
          borderRadius: "12px",
          color: "#6B7280",
          fontSize: "14px"
        }}
      >
        Loading map...
      </div>
    );
  }

  // Show error state
  if (apiError || mapError) {
    return <MapFallback height={height} />;
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

