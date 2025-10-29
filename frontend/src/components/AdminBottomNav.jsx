import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline, IoPeopleOutline, IoCarSportOutline, IoDocumentTextOutline, IoSettingsOutline } from "react-icons/io5";

export default function AdminBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", icon: IoHomeOutline, label: "Dashboard" },
    { path: "/admin/users", icon: IoPeopleOutline, label: "Users" },
    { path: "/admin/drivers", icon: IoCarSportOutline, label: "Drivers" },
    { path: "/admin/disputes", icon: IoDocumentTextOutline, label: "Disputes" },
    { path: "/admin/settings", icon: IoSettingsOutline, label: "Settings" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || 
                        (item.path === "/admin/dashboard" && location.pathname === "/admin");
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

