import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminBottomNav from "../components/AdminBottomNav";
import { api } from "../utils/api";

export default function AdminDisputes() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminDisputes();
      if (data && data.success && data.disputes) {
        setDisputes(data.disputes);
      } else {
        setDisputes([]);
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title">Disputes</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ paddingBottom: "80px" }}>
        <div style={{ padding: "20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading...
            </div>
          ) : disputes.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {disputes.map((dispute) => (
                <div
                  key={dispute._id}
                  className="admin-card"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s"
                  }}
                  onClick={() => navigate(`/admin/disputes/${dispute._id}`)}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px"
                  }}>
                    <div>
                      <div style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        marginBottom: "4px"
                      }}>
                        Dispute #{dispute.disputeId}
                      </div>
                      <div style={{
                        fontSize: "13px",
                        color: "var(--text-muted)"
                      }}>
                        {dispute.category}
                      </div>
                    </div>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: "#DBEAFE",
                      color: "#3B82F6"
                    }}>
                      {dispute.status}
                    </span>
                  </div>
                  <div style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px"
                  }}>
                    Passenger: {dispute.passenger} • Driver: {dispute.driver}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "var(--text-muted)"
                  }}>
                    Date: {dispute.date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No disputes found
            </div>
          )}
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}

