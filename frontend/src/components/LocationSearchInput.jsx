import { useRef, useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

export default function LocationSearchInput({ 
  value, 
  onChange, 
  placeholder, 
  type = "pickup",
  icon: Icon 
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn("Google Maps API not loaded yet. Input will work without autocomplete.");
      return;
    }

    if (!inputRef.current) return;

    // Initialize Google Places Autocomplete with Uber/Lyft style options
    const options = {
      componentRestrictions: { country: "ca" }, // Restrict to Canada
      fields: ["address_components", "formatted_address", "geometry", "name"],
      // Allow all establishment types for better suggestions
      types: ["geocode"],
    };

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // Style the autocomplete dropdown
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        pacContainer.style.zIndex = '9999';
        pacContainer.style.borderRadius = '12px';
        pacContainer.style.marginTop = '4px';
        pacContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        
        if (!place || !place.address_components) {
          return;
        }
        
        // Extract city and province
        let city = "";
        let province = "";
        
        place.address_components.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            province = component.short_name; // ON, QC, BC, etc.
          }
        });

        // Format as "City, Province" like Uber/Lyft
        const locationString = city && province 
          ? `${city}, ${province}` 
          : place.formatted_address || place.name;
          
        onChange(locationString);
      });
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`input-group ${isFocused ? "focused" : ""}`}>
      <Icon className="input-icon" />
      <input
        ref={inputRef}
        className="input autocomplete-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        autoComplete="new-password"
        spellCheck="false"
      />
      {value && (
        <button 
          type="button" 
          className="input-clear-btn" 
          onClick={handleClear}
          onMouseDown={(e) => e.preventDefault()}
        >
          <IoCloseCircle size={20} />
        </button>
      )}
    </div>
  );
}

