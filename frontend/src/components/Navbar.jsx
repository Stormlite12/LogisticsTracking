import { Link, useNavigate } from "react-router-dom";
import { theme } from "../theme";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Link 
            to={role === "superadmin" ? "/superadmin" : role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/dashboard"} 
            style={styles.logo}
          >
            <span style={styles.logoIcon}>🚚</span>
            <span style={styles.logoText}>FleetFlow</span>
          </Link>
          
          <div style={styles.navLinks}>
            {role === "superadmin" && (
              <>
                <Link to="/superadmin" style={styles.navLink}>Companies</Link>
                <Link to="/superadmin/logs" style={styles.navLink}>System Logs</Link>
              </>
            )}
            {role === "customer" && (
              <Link to="/post-load" style={styles.navLink}>Post Load</Link>
            )}
            {role === "driver" && (
              <Link to="/post-truck" style={styles.navLink}>Post Truck</Link>
            )}
          </div>
        </div>
        
        <div style={styles.rightSection}>
          <span style={styles.roleBadge}>
            {role === "superadmin" ? "Super Admin" : role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    boxShadow: theme.shadows.md,
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "32px"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: theme.colors.white,
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "20px"
  },
  logoIcon: {
    fontSize: "28px"
  },
  logoText: {
    letterSpacing: "-0.5px"
  },
  navLinks: {
    display: "flex",
    gap: "24px"
  },
  navLink: {
    color: theme.colors.white,
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    opacity: 0.9,
    transition: "opacity 0.2s",
    ":hover": {
      opacity: 1
    }
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  roleBadge: {
    background: "rgba(255,255,255,0.15)",
    color: theme.colors.white,
    padding: "6px 12px",
    borderRadius: theme.radius.full,
    fontSize: "13px",
    fontWeight: "600",
    backdropFilter: "blur(10px)"
  },
  logoutButton: {
    background: theme.colors.danger,
    color: theme.colors.white,
    border: "none",
    padding: "8px 16px",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: theme.shadows.md
    }
  }
};