import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoPaperPlaneOutline, IoAttachOutline } from "react-icons/io5";
import AdminBottomNav from "../components/AdminBottomNav";
import { api } from "../utils/api";

export default function AdminDisputeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dispute, setDispute] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputeDetail();
  }, [id]);

  const fetchDisputeDetail = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminDisputeDetail(id);
      if (data) {
        setDispute(data.dispute);
        setMessages(data.messages || []);
      } else {
        // Mock data for now
        setDispute({
          disputeId: "12345",
          rideId: "67890",
          category: "Fare Dispute",
          date: "2024-07-26",
          passenger: { name: "Alex Turner", avatar: "👤" },
          driver: { name: "Ethan Carter", avatar: "👤" },
          reason: "Overcharge",
          status: "Open"
        });
        setMessages([
          {
            _id: "1",
            sender: "passenger",
            senderName: "Alex Turner",
            senderAvatar: "👤",
            text: "I was charged more than the estimated fare. The driver took a longer route.",
            timestamp: "2024-07-26T10:00:00Z"
          },
          {
            _id: "2",
            sender: "admin",
            senderName: "Admin",
            senderAvatar: "👤",
            text: "We are investigating the route taken. Please provide any evidence you have.",
            timestamp: "2024-07-26T10:15:00Z"
          },
          {
            _id: "3",
            sender: "driver",
            senderName: "Ethan Carter",
            senderAvatar: "👤",
            text: "I followed the GPS route. There might have been traffic.",
            timestamp: "2024-07-26T10:30:00Z"
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dispute detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const data = await api.sendDisputeMessage(id, { text: messageText });
      if (data && data.message) {
        setMessages([...messages, data.message]);
        setMessageText("");
      } else {
        // Mock - add message locally
        setMessages([...messages, {
          _id: Date.now().toString(),
          sender: "admin",
          senderName: "Admin",
          senderAvatar: "👤",
          text: messageText,
          timestamp: new Date().toISOString()
        }]);
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleResolve = async () => {
    try {
      await api.resolveDispute(id);
      navigate("/admin/disputes");
    } catch (error) {
      console.error("Error resolving dispute:", error);
    }
  };

  const handleEscalate = async () => {
    try {
      await api.escalateDispute(id);
      navigate("/admin/disputes");
    } catch (error) {
      console.error("Error escalating dispute:", error);
    }
  };

  if (loading || !dispute) {
    return (
      <div className="page">
        <header className="header">
          <button className="back-btn" onClick={() => navigate("/admin/disputes")}>
            <IoArrowBackOutline size={24} />
          </button>
          <h1 className="page-title">Dispute Resolution</h1>
          <div style={{ width: "24px" }}></div>
        </header>
        <main className="content" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Loading...
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn" onClick={() => navigate("/admin/disputes")}>
          <IoArrowBackOutline size={24} />
        </button>
        <h1 className="page-title">Dispute Resolution</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ paddingBottom: "180px" }}>
        {/* Dispute Details */}
        <div style={{ padding: "20px" }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "var(--text-primary)"
          }}>
            Dispute Details
          </h2>
          <div className="admin-card">
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              fontSize: "14px"
            }}>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Dispute ID</div>
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  #{dispute.disputeId}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Passenger</div>
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  {dispute.passenger?.name || dispute.passenger}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Ride ID</div>
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  #{dispute.rideId}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Driver</div>
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  {dispute.driver?.name || dispute.driver}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Category</div>
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  {dispute.category}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Reason</div>
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  {dispute.reason}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Date</div>
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  {dispute.date}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Status</div>
                <div style={{ 
                  fontWeight: "500", 
                  color: "#3B82F6",
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  backgroundColor: "#DBEAFE",
                  fontSize: "12px"
                }}>
                  {dispute.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication */}
        <div style={{ padding: "0 20px 20px" }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "var(--text-primary)"
          }}>
            Communication
          </h2>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "16px",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "12px"
          }}>
            {messages.map((msg) => {
              const isAdmin = msg.sender === "admin";
              return (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    flexDirection: isAdmin ? "row-reverse" : "row"
                  }}
                >
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: isAdmin ? "#3B82F6" : "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0
                  }}>
                    {msg.senderAvatar || "👤"}
                  </div>
                  <div style={{
                    maxWidth: "70%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isAdmin ? "flex-end" : "flex-start"
                  }}>
                    <div style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "4px"
                    }}>
                      {msg.senderName}
                    </div>
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: "16px",
                      backgroundColor: isAdmin ? "#3B82F6" : "#FFFFFF",
                      color: isAdmin ? "#FFFFFF" : "var(--text-primary)",
                      fontSize: "14px",
                      lineHeight: "1.4",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Input */}
        <div style={{
          padding: "0 20px 20px",
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "24px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-primary)",
              fontSize: "15px",
              color: "var(--text-primary)",
              outline: "none"
            }}
          />
          <button
            style={{
              padding: "10px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "var(--text-muted)"
            }}
          >
            <IoAttachOutline size={24} />
          </button>
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px",
              border: "none",
              backgroundColor: "#3B82F6",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFFFF"
            }}
          >
            <IoPaperPlaneOutline size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: "0 20px 20px",
          display: "flex",
          gap: "12px"
        }}>
          <button
            onClick={handleEscalate}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "2px solid var(--border-color)",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Escalate
          </button>
          <button
            onClick={handleResolve}
            className="btn"
            style={{
              flex: 1,
              fontSize: "15px",
              fontWeight: "600"
            }}
          >
            Resolve
          </button>
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}

