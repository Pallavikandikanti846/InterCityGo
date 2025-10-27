// Google Maps API Test Utility
// This file helps test and debug Google Maps API issues

export const testGoogleMapsAPI = () => {
  console.log("=== Google Maps API Test ===");
  
  // Check if Google Maps is loaded
  if (!window.google) {
    console.error("❌ Google Maps not loaded");
    return false;
  }
  
  if (!window.google.maps) {
    console.error("❌ Google Maps API not available");
    return false;
  }
  
  console.log("✅ Google Maps API loaded");
  
  // Check for places library
  if (window.google.maps.places) {
    console.log("✅ Places library loaded");
    
    // Check for new PlaceAutocompleteElement
    if (window.google.maps.places.PlaceAutocompleteElement) {
      console.log("✅ PlaceAutocompleteElement available (new API)");
    } else {
      console.log("⚠️ PlaceAutocompleteElement not available, using legacy Autocomplete");
    }
  } else {
    console.error("❌ Places library not loaded");
  }
  
  // Check for marker library
  if (window.google.maps.marker) {
    console.log("✅ Marker library loaded");
    
    // Check for AdvancedMarkerElement
    if (window.google.maps.marker.AdvancedMarkerElement) {
      console.log("✅ AdvancedMarkerElement available (new API)");
    } else {
      console.log("⚠️ AdvancedMarkerElement not available, using legacy Marker");
    }
  } else {
    console.log("⚠️ Marker library not loaded");
  }
  
  // Test API key restrictions
  const testGeocoder = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: "Toronto, ON" }, (results, status) => {
      if (status === "OK") {
        console.log("✅ Geocoding works - API key is valid");
      } else if (status === "REQUEST_DENIED") {
        console.error("❌ API key denied - check restrictions");
        console.log("🔍 Check these in Google Cloud Console:");
        console.log("   - API key is active");
        console.log("   - No application restrictions");
        console.log("   - Billing is enabled");
        console.log("   - Required APIs are enabled");
      } else if (status === "OVER_QUERY_LIMIT") {
        console.error("❌ API quota exceeded");
      } else if (status === "INVALID_REQUEST") {
        console.error("❌ Invalid request - check API key format");
      } else if (status === "UNKNOWN_ERROR") {
        console.error("❌ Unknown error - try again later");
      } else {
        console.warn("⚠️ Geocoding test failed:", status);
      }
    });
  };
  
  // Run geocoding test after a short delay
  setTimeout(testGeocoder, 1000);
  
  return true;
};

// Function to check API key configuration
export const checkAPIKeyConfig = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
  
  console.log("=== API Key Configuration ===");
  
  if (!apiKey) {
    console.error("❌ No API key found in environment variables");
    console.log("Please add VITE_GOOGLE_MAPS_API_KEY to your .env file");
    return false;
  }
  
  console.log("✅ API key found:", apiKey.substring(0, 10) + "...");
  
  // Check if API key looks valid (starts with AIza)
  if (apiKey.startsWith("AIza")) {
    console.log("✅ API key format looks correct");
  } else {
    console.warn("⚠️ API key format might be incorrect (should start with 'AIza')");
  }
  
  // Check Map ID
  if (mapId) {
    console.log("✅ Map ID found:", mapId.substring(0, 10) + "...");
    console.log("✅ Advanced Markers should work");
  } else {
    console.log("⚠️ No Map ID found - Advanced Markers will use legacy Markers");
    console.log("💡 To enable Advanced Markers, add VITE_GOOGLE_MAPS_MAP_ID to your .env file");
    console.log("   Get Map ID from: https://console.cloud.google.com/google/maps-apis/studio");
  }
  
  return true;
};

// Function to provide troubleshooting steps
export const getTroubleshootingSteps = () => {
  console.log("=== Troubleshooting Steps ===");
  console.log("🔑 API Key Issues Detected:");
  console.log("");
  console.log("1. Fix API Key Restrictions:");
  console.log("   - Go to https://console.cloud.google.com/");
  console.log("   - Select your project");
  console.log("   - Go to 'APIs & Services' > 'Credentials'");
  console.log("   - Click on your API key");
  console.log("   - Under 'Application restrictions':");
  console.log("     • Select 'None' for development");
  console.log("     • OR add 'localhost' and your domain to HTTP referrers");
  console.log("     • OR add your IP address to IP addresses");
  console.log("");
  console.log("2. Enable Required APIs:");
  console.log("   - Go to 'APIs & Services' > 'Library'");
  console.log("   - Enable these APIs:");
  console.log("     • Maps JavaScript API");
  console.log("     • Places API");
  console.log("     • Geocoding API");
  console.log("");
  console.log("3. Check Billing:");
  console.log("   - Go to 'Billing' in the console");
  console.log("   - Ensure billing is enabled");
  console.log("   - Check if you have exceeded quotas");
  console.log("");
  console.log("4. For Development (Quick Fix):");
  console.log("   - Temporarily remove ALL restrictions on your API key");
  console.log("   - This allows the app to work on any domain");
  console.log("   - Remember to add restrictions before production!");
  console.log("");
  console.log("5. Environment Variables:");
  console.log("   - Make sure .env file is in the frontend directory");
  console.log("   - Restart your development server after changes");
  console.log("");
  console.log("🚀 After making changes, refresh this page to test again.");
};
