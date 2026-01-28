import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { theme } from "../theme";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    api.get("/customer/bookings").then(res => setBookings(res.data));
    api.get("/customer/loads").then(res => setLoads(res.data));
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return theme.colors.warning;
      case 'matched': return theme.colors.success;
      case 'delivered': return theme.colors.primary;
      default: return theme.colors.gray600;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.headerSection}>
          <div>
            <h2 style={styles.title}>Dashboard</h2>
            <p style={styles.subtitle}>Manage your loads and track bookings</p>
          </div>
          <button onClick={() => navigate("/post-load")} style={styles.primaryButton}>
            <span style={styles.buttonIcon}>+</span>
            Post New Load
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`}}>
            <div style={styles.statIcon}>📦</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{loads.length}</div>
              <div style={styles.statLabel}>Total Loads</div>
            </div>
          </div>
          
          <div style={{...styles.statCard, background: `linear-gradient(135deg, ${theme.colors.success} 0%, #059669 100%)`}}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{loads.filter(l => l.status === 'matched').length}</div>
              <div style={styles.statLabel}>Matched</div>
            </div>
          </div>
          
          <div style={{...styles.statCard, background: `linear-gradient(135deg, ${theme.colors.warning} 0%, #d97706 100%)`}}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{loads.filter(l => l.status === 'pending').length}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
          </div>
        </div>

        {/* Posted Loads */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Your Posted Loads</h3>
          {loads.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📭</span>
              <p style={styles.emptyText}>No loads posted yet</p>
              <button onClick={() => navigate("/post-load")} style={styles.secondaryButton}>
                Post Your First Load
              </button>
            </div>
          ) : (
            <div style={styles.cardGrid}>
              {loads.map(load => (
                <div key={load._id} style={styles.loadCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.loadIcon}>📦</span>
                    <span style={{...styles.statusBadge, backgroundColor: getStatusColor(load.status) + '20', color: getStatusColor(load.status)}}>
                      {load.status}
                    </span>
                  </div>
                  <h4 style={styles.cardTitle}>{load.material}</h4>
                  <div style={styles.loadDetails}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>⚖️</span>
                      <span style={styles.detailText}>{load.requiredCapacity} Tons</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>📍</span>
                      <span style={styles.detailText}>{load.from} → {load.to}</span>
                    </div>
                  </div>
                  <div style={styles.cardFooter}>
                    <span style={styles.dateText}>
                      Posted {new Date(load.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Your Bookings</h3>
          {bookings.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📋</span>
              <p style={styles.emptyText}>No bookings yet</p>
            </div>
          ) : (
            bookings.map(b => (
              <div key={b._id} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <span style={styles.bookingIcon}>🚚</span>
                  <div>
                    <h4 style={styles.bookingTitle}>{b.load?.material}</h4>
                    <p style={styles.bookingRoute}>{b.from} → {b.to}</p>
                  </div>
                </div>
                <span style={{...styles.statusBadge, backgroundColor: theme.colors.primary + '20', color: theme.colors.primary}}>
                  {b.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    background: theme.colors.gray50,
    padding: "32px 24px"
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: theme.colors.gray900,
    margin: "0 0 4px 0"
  },
  subtitle: {
    fontSize: "16px",
    color: theme.colors.gray600,
    margin: 0
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    border: "none",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: theme.shadows.md,
    transition: "transform 0.2s"
  },
  buttonIcon: {
    fontSize: "20px",
    lineHeight: 1
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  statCard: {
    padding: "24px",
    borderRadius: theme.radius.lg,
    color: theme.colors.white,
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: theme.shadows.md
  },
  statIcon: {
    fontSize: "32px"
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px"
  },
  statLabel: {
    fontSize: "14px",
    opacity: 0.9
  },
  section: {
    marginBottom: "40px"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: theme.colors.gray900,
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  loadCard: {
    background: theme.colors.white,
    padding: "24px",
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.gray200}`,
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows.lg
    }
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  loadIcon: {
    fontSize: "24px"
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: theme.radius.full,
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize"
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: theme.colors.gray900,
    marginBottom: "16px"
  },
  loadDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px"
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  detailIcon: {
    fontSize: "16px"
  },
  detailText: {
    fontSize: "14px",
    color: theme.colors.gray600
  },
  cardFooter: {
    paddingTop: "16px",
    borderTop: `1px solid ${theme.colors.gray200}`
  },
  dateText: {
    fontSize: "13px",
    color: theme.colors.gray600
  },
  emptyState: {
    textAlign: "center",
    padding: "64px 24px",
    background: theme.colors.white,
    borderRadius: theme.radius.lg,
    border: `2px dashed ${theme.colors.gray300}`
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
    display: "block"
  },
  emptyText: {
    fontSize: "16px",
    color: theme.colors.gray600,
    marginBottom: "24px"
  },
  secondaryButton: {
    padding: "10px 20px",
    background: theme.colors.white,
    color: theme.colors.primary,
    border: `2px solid ${theme.colors.primary}`,
    borderRadius: theme.radius.md,
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  },
  bookingCard: {
    background: theme.colors.white,
    padding: "20px",
    borderRadius: theme.radius.md,
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.gray200}`
  },
  bookingHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  bookingIcon: {
    fontSize: "32px"
  },
  bookingTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: theme.colors.gray900,
    margin: "0 0 4px 0"
  },
  bookingRoute: {
    fontSize: "14px",
    color: theme.colors.gray600,
    margin: 0
  }
};
