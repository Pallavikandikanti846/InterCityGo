import { Link, useLocation } from "react-router-dom";
import { IoGridOutline, IoGrid } from "react-icons/io5";
import { RiSuitcaseLine } from "react-icons/ri";
import { MdOutlinePayment, MdPayment } from "react-icons/md";
import { IoPersonOutline, IoPerson } from "react-icons/io5";

export default function DriverBottomNav() {
  const location = useLocation();

  const navItems = [
    { 
      path: "/driver/dashboard", 
      icon: IoGridOutline, 
      iconActive: IoGrid,
      label: "Dashboard" 
    },
    { 
      path: "/driver/rides", 
      icon: RiSuitcaseLine, 
      iconActive: RiSuitcaseLine,
      label: "My Rides" 
    },
    { 
      path: "/driver/earnings", 
      icon: MdOutlinePayment, 
      iconActive: MdPayment,
      label: "Earnings" 
    },
    { 
      path: "/driver/profile", 
      icon: IoPersonOutline, 
      iconActive: IoPerson,
      label: "Profile" 
    },
  ];

  return (
    <nav className="bottom-nav" style={{ backgroundColor: "#1F2937", borderTop: "1px solid #374151" }}>
      {navItems.map((item) => {
        const Icon = location.pathname === item.path && item.iconActive ? item.iconActive : item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            style={{
              color: location.pathname === item.path ? "#60A5FA" : "#9CA3AF",
            }}
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

