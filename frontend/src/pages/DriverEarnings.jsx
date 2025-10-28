import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCarSportOutline, IoCheckmarkCircle, IoChevronForward } from "react-icons/io5";
import DriverBottomNav from "../components/DriverBottomNav";
import { api } from "../utils/api";

export default function DriverEarnings() {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState({
    total: 0,
    payments: [],
    rideHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await api.getDriverEarnings();
      
      if (data.success) {
        setEarnings({
          total: data.totalEarnings || 0,
          payments: data.payments || [],
          rideHistory: data.completedRides || []
        });
      } else {
        // If no earnings yet, set to empty
        setEarnings({
          total: 0,
          payments: [],
          rideHistory: []
        });
      }
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
      // Set to empty on error
      setEarnings({
        total: 0,
        payments: [],
        rideHistory: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>Earnings</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827", paddingBottom: "90px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "#9CA3AF" }}>Loading earnings...</p>
          </div>
        ) : (
          <>
            {/* Total Earnings Card */}
            <div style={{
              backgroundColor: "#1E3A8A",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
            }}>
              <p style={{ 
                fontSize: "14px", 
                color: "#DBEAFE", 
                margin: 0, 
                marginBottom: "8px" 
              }}>
                Total Earnings
              </p>
              <h2 style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#FFFFFF",
                margin: 0,
              }}>
                ${earnings.total.toLocaleString()}
              </h2>
            </div>

            {/* Payment Breakdown */}
            {earnings.payments.length > 0 && (
              <section style={{ marginBottom: "32px" }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#F9FAFB",
                  marginBottom: "16px",
                }}>
                  Payment Breakdown
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {earnings.payments.map((payment) => (
                    <div
                      key={payment.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px",
                        backgroundColor: "#1F2937",
                        borderRadius: "12px",
                      }}
                    >
                      <IoCarSportOutline size={24} style={{ color: "#60A5FA" }} />
                      <div style={{ flex: 1 }}>
                        <p style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#F9FAFB",
                        }}>
                          ${payment.amount}
                        </p>
                        <p style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#9CA3AF",
                        }}>
                          {payment.trip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ride History */}
            {earnings.rideHistory.length > 0 && (
              <section>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#F9FAFB",
                  marginBottom: "16px",
                }}>
                  Ride History
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {earnings.rideHistory.map((ride) => (
                    <div
                      key={ride.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px",
                        backgroundColor: "#1F2937",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/driver/ride-details/${ride.id}`)}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#1E3A8A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <IoCheckmarkCircle size={24} style={{ color: "#10B981" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#F9FAFB",
                        }}>
                          Completed
                        </p>
                        <p style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#9CA3AF",
                        }}>
                          {ride.route}
                        </p>
                      </div>
                      <IoChevronForward size={20} style={{ color: "#9CA3AF" }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {earnings.payments.length === 0 && earnings.rideHistory.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "40px 20px",
                backgroundColor: "#1F2937",
                borderRadius: "12px",
                border: "1px solid #374151",
              }}>
                <IoCarSportOutline size={60} style={{ color: "#60A5FA", marginBottom: "16px" }} />
                <h3 style={{ color: "#F9FAFB", marginBottom: "8px" }}>No Earnings Yet</h3>
                <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
                  Complete your first ride to start earning!
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <DriverBottomNav />
    </div>
  );
}
