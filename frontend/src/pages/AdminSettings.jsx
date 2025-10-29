import { useNavigate } from "react-router-dom";
import { 
  IoArrowForwardOutline,
  IoCashOutline, 
  IoRepeatOutline, 
  IoPricetagOutline,
  IoLocationOutline, 
  IoAppsOutline,
  IoNotificationsOutline 
} from "react-icons/io5";
import AdminBottomNav from "../components/AdminBottomNav";

export default function AdminSettings() {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "Pricing Rules",
      items: [
        {
          icon: IoCashOutline,
          title: "Base Fares",
          description: "Manage pricing structures",
          onClick: () => {}
        },
        {
          icon: IoRepeatOutline,
          title: "Surge Pricing",
          description: "Set multipliers for peak hours",
          onClick: () => {}
        },
        {
          icon: IoPricetagOutline,
          title: "Discounts & Promotions",
          description: "Configure discounts for users",
          onClick: () => {}
        },
      ]
    },
    {
      title: "Service Areas",
      items: [
        {
          icon: IoLocationOutline,
          title: "City Boundaries",
          description: "Define service boundaries",
          onClick: () => {}
        },
        {
          icon: IoAppsOutline,
          title: "Zone Management",
          description: "Manage zones with different rules",
          onClick: () => {}
        },
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          icon: IoNotificationsOutline,
          title: "Notification Templates",
          description: "Customize notifications",
          onClick: () => {}
        },
      ]
    },
  ];

  return (
    <div className="page">
      <header className="header">
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title">Settings</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ paddingBottom: "80px" }}>
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} style={{ padding: sectionIndex === 0 ? "20px" : "0 20px 20px" }}>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "var(--text-primary)"
            }}>
              {section.title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className="admin-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      cursor: "pointer",
                      transition: "transform 0.2s"
                    }}
                    onClick={item.onClick}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: "#EFF6FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3B82F6",
                      flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "var(--text-primary)",
                        marginBottom: "4px"
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontSize: "13px",
                        color: "var(--text-muted)"
                      }}>
                        {item.description}
                      </div>
                    </div>
                    <IoArrowForwardOutline 
                      size={20} 
                      style={{ 
                        color: "var(--text-muted)",
                        flexShrink: 0
                      }} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      <AdminBottomNav />
    </div>
  );
}

