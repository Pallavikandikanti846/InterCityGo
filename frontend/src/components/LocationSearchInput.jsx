import { useRef, useEffect, useState } from "react";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import { IoClose } from "react-icons/io5";

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
  const { isLoaded, error: apiError } = useGoogleMaps();
  const observerRef = useRef(null);

  // Handle keyboard events for Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger the first suggestion selection
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        const firstSuggestion = pacContainer.querySelector('.pac-item:first-child');
        if (firstSuggestion) {
          firstSuggestion.click();
        }
      }
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    // Check if Places library is available
    if (!window.google.maps.places) {
      return;
    }

    if (!inputRef.current) return;

    // Use legacy Autocomplete for reliable behavior
    try {
      const options = {
        componentRestrictions: { country: "ca" }, // Restrict to Canada
        fields: ["address_components", "formatted_address", "geometry", "name"],
        types: ["geocode"],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

        // Style the autocomplete dropdown and improve click handling
        const stylePacContainer = () => {
          const pacContainer = document.querySelector('.pac-container');
          if (pacContainer) {
            pacContainer.style.zIndex = '9999';
            pacContainer.style.borderRadius = '12px';
            pacContainer.style.marginTop = '4px';
            pacContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            
            // Add click event listener to pac items for better selection
            pacContainer.addEventListener('click', (e) => {
              const pacItem = e.target.closest('.pac-item');
              if (pacItem) {
                // Trigger the selection immediately
                pacItem.click();
              }
            });
          }
        };

        // Style immediately and also after a delay to catch dynamically created containers
        stylePacContainer();
        setTimeout(stylePacContainer, 100);

        // Use MutationObserver to watch for pac-container changes
        observerRef.current = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('pac-container')) {
                  stylePacContainer();
                }
              });
            }
          });
        });

        observerRef.current.observe(document.body, {
          childList: true,
          subtree: true
        });

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

        // Add keyboard event listener for Enter key
        const inputElement = inputRef.current;
        inputElement.addEventListener('keydown', handleKeyDown);
    } catch (error) {
      // Fallback to manual input mode if autocomplete fails
      if (inputRef.current) {
        inputRef.current.addEventListener('input', handleInputChange);
      }
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (cleanupError) {
          console.warn("Error during autocomplete cleanup:", cleanupError);
        }
      }
      
      // Remove keyboard event listener
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', handleKeyDown);
      }
      
      // Disconnect observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoaded, onChange, placeholder]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
          onClick={handleClear}
          className="clear-button"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            zIndex: 10
          }}
        >
          <IoClose size={16} />
        </button>
      )}
    </div>
  );
}

