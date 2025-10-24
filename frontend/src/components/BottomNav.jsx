import { Link, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { RiSuitcaseLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: IoSearchOutline, label: "Search" },
    { path: "/trips", icon: RiSuitcaseLine, label: "Trips" },
    { path: "/payments", icon: MdOutlinePayment, label: "Payments" },
    { path: "/profile", icon: IoPersonOutline, label: "Profile" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

