import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminBottomNav from "../components/AdminBottomNav";
import { api } from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeDrivers: 0,
    pendingVerifications: 0,
    ongoingDisputes: 0,
    totalBookings: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real data from users and drivers
      const [usersData, driversData] = await Promise.allSettled([
        api.getAdminUsers().catch(() => ({ success: false, users: [] })),
        api.getAdminDrivers().catch(() => ({ success: false, drivers: [] })),
      ]);
      
      const users = usersData.status === 'fulfilled' && usersData.value?.users ? usersData.value.users : [];
      const drivers = driversData.status === 'fulfilled' && driversData.value?.drivers ? driversData.value.drivers : [];
      
      // Calculate real stats
      setStats({
        activeDrivers: drivers.length,
        pendingVerifications: 0, // Will be implemented when verification system is added
        ongoingDisputes: 0, // Will be implemented when disputes system is added
        totalBookings: 0, // Will be implemented when bookings are tracked
      });
      
      // Set empty activity for now - will be implemented later
      setRecentActivity([]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        activeDrivers: 0,
        pendingVerifications: 0,
        ongoingDisputes: 0,
        totalBookings: 0,
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title">Dashboard</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ paddingBottom: "80px" }}>
        {/* Summary Cards */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "12px" 
          }}>
            <div 
              className="admin-card"
              style={{ 
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onClick={() => navigate("/admin/drivers")}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Active Drivers
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
                {loading ? "..." : stats.activeDrivers.toLocaleString()}
              </div>
            </div>
            <div className="admin-card">
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Pending Verifications
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
                {loading ? "..." : stats.pendingVerifications}
              </div>
            </div>
            <div 
              className="admin-card"
              style={{ 
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onClick={() => navigate("/admin/disputes")}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Ongoing Disputes
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
                {loading ? "..." : stats.ongoingDisputes}
              </div>
            </div>
            <div className="admin-card">
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Total Bookings
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)" }}>
                {loading ? "..." : stats.totalBookings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ padding: "0 20px 20px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px",
            color: "var(--text-primary)"
          }}>
            Recent Activity
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                Loading...
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="admin-card"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    cursor: "pointer",
                    transition: "transform 0.2s"
                  }}
                  onClick={() => {
                    if (activity.type === "dispute") navigate("/admin/disputes");
                    else if (activity.type === "driver") navigate("/admin/drivers");
                    else if (activity.type === "booking") navigate("/admin/dashboard");
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: "15px", 
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "4px"
                    }}>
                      {activity.title}
                    </div>
                    <div style={{ 
                      fontSize: "13px", 
                      color: "var(--text-muted)"
                    }}>
                      {activity.type === "driver" ? "Driver" : activity.type === "booking" ? "Booking" : "Dispute"} ID: {activity.id}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                No recent activity
              </div>
            )}
          </div>
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}

