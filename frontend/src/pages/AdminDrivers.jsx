import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline, IoAddOutline, IoSearchOutline } from "react-icons/io5";
import AdminBottomNav from "../components/AdminBottomNav";
import { api } from "../utils/api";

export default function AdminDrivers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminDrivers();
      if (data && data.success && data.drivers) {
        setDrivers(data.drivers.map(driver => ({
          ...driver,
          status: driver.status || "Offline"
        })));
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.carModel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page">
      <header className="header">
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title">Drivers</h1>
        <button className="back-btn" onClick={() => {}}>
          <IoAddOutline size={24} />
        </button>
      </header>

      <main className="content" style={{ paddingBottom: "100px" }}>
        {/* Search Bar */}
        <div style={{ padding: "20px" }}>
          <div style={{ 
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <IoSearchOutline 
              size={20} 
              style={{ 
                position: "absolute", 
                left: "12px", 
                color: "var(--text-muted)" 
              }} 
            />
            <input
              type="text"
              placeholder="Search drivers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
                fontSize: "15px",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Driver List */}
        <div style={{ padding: "0 20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading...
            </div>
          ) : filteredDrivers.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className="admin-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    transition: "transform 0.2s"
                  }}
                  onClick={() => {}}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    flexShrink: 0
                  }}>
                    {driver.avatar || "👤"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "4px"
                    }}>
                      {driver.name}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: driver.status === "Online" ? "#10B981" : "var(--text-muted)",
                      fontWeight: "500",
                      marginBottom: driver.carModel ? "2px" : "0"
                    }}>
                      {driver.status || "Offline"}
                    </div>
                    {driver.carModel && (
                      <div style={{
                        fontSize: "12px",
                        color: "var(--text-muted)"
                      }}>
                        {driver.carModel}
                      </div>
                    )}
                  </div>
                  <IoArrowBackOutline 
                    size={20} 
                    style={{ 
                      transform: "rotate(180deg)", 
                      color: "var(--text-muted)",
                      flexShrink: 0
                    }} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No drivers found
            </div>
          )}
        </div>
      </main>

      {/* Add Driver Button */}
      <div style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: "390px",
        zIndex: 10
      }}>
        <button
          className="btn"
          onClick={() => {}}
          style={{
            width: "100%",
            fontSize: "16px",
            fontWeight: "600"
          }}
        >
          + Add Driver
        </button>
      </div>

      <AdminBottomNav />
    </div>
  );
}

