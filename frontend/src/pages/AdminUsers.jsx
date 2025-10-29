import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline, IoAddOutline, IoSearchOutline } from "react-icons/io5";
import AdminBottomNav from "../components/AdminBottomNav";
import { api } from "../utils/api";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All"); // All, Active, Inactive
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminUsers();
      if (data && data.success && data.users) {
        // Map users with status (consider all registered users as Active for now)
        setUsers(data.users.map(user => ({
          ...user,
          status: "Active" // All registered users are considered active
        })));
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page">
      <header className="header">
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title">Users</h1>
        <button className="back-btn" onClick={() => {}}>
          <IoAddOutline size={24} />
        </button>
      </header>

      <main className="content" style={{ paddingBottom: "80px" }}>
        {/* Search Bar */}
        <div style={{ padding: "20px 20px 12px" }}>
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
              placeholder="Search users"
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

        {/* Filter Tabs */}
        <div style={{ padding: "0 20px 16px", display: "flex", gap: "8px" }}>
          {["All", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: filter === tab ? "#3B82F6" : "var(--bg-secondary)",
                color: filter === tab ? "#FFFFFF" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* User List */}
        <div style={{ padding: "0 20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading...
            </div>
          ) : filteredUsers.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
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
                    {user.avatar || "👤"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "4px"
                    }}>
                      {user.name}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "var(--text-muted)"
                    }}>
                      Joined {user.joined}
                    </div>
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
              No users found
            </div>
          )}
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}

