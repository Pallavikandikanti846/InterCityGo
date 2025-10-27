// Simple API key test utility
export const testAPIKeyDirectly = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  console.log("=== Direct API Key Test ===");
  console.log("API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "Not found");
  
  if (!apiKey) {
    console.error("❌ No API key found in environment variables");
    return;
  }
  
  // Test with a simple fetch request
  const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Toronto&key=${apiKey}`;
  
  fetch(testUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === "OK") {
        console.log("✅ Direct API test successful - API key works");
        console.log("📍 Test result:", data.results[0].formatted_address);
      } else {
        console.error("❌ Direct API test failed:", data.status);
        console.error("Error details:", data.error_message || "No error message");
        
        if (data.status === "REQUEST_DENIED") {
          console.log("🔧 Possible solutions:");
          console.log("1. Check if billing is enabled");
          console.log("2. Verify APIs are enabled (Maps JavaScript API, Places API)");
          console.log("3. Check if API key is active");
          console.log("4. Verify no restrictions are set");
        }
      }
    })
    .catch(error => {
      console.error("❌ Network error:", error);
    });
};

// Test the current domain
export const testCurrentDomain = () => {
  console.log("=== Domain Information ===");
  console.log("Current URL:", window.location.href);
  console.log("Protocol:", window.location.protocol);
  console.log("Hostname:", window.location.hostname);
  console.log("Port:", window.location.port);
  
  // Check if running on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log("✅ Running on localhost - should work with unrestricted API key");
  } else {
    console.log("⚠️ Not running on localhost - may need domain restrictions");
  }
};

