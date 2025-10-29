export default function MapFallback({ height = "280px" }) {
  return (
    <div 
      style={{ 
        height, 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%)",
        borderRadius: "12px",
        color: "#6B7280",
        fontSize: "14px",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>🗺️</div>
      <div style={{ fontWeight: "600", marginBottom: "8px" }}>Map Unavailable</div>
      <div style={{ fontSize: "12px", opacity: 0.8 }}>
        Google Maps is not available.<br />
        Check console for troubleshooting steps.
      </div>
    </div>
  );
}

