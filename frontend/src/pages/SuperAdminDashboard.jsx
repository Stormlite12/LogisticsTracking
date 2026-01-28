import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tenants");
      setTenants(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTenantStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/tenants/${id}/status`, { isActive: !currentStatus });
      fetchTenants();
    } catch (err) {
      alert("Error updating tenant status");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>Super Admin - Company Management</h2>
        
        <h3 style={styles.sectionTitle}>Registered Companies (Tenants)</h3>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {tenants.map(tenant => (
              <div key={tenant._id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{tenant.name}</p>
                    <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6b7280' }}>Plan: <span style={{ textTransform: 'uppercase', fontWeight: '600' }}>{tenant.plan}</span></p>
                  </div>
                  <span style={{ 
                    ...styles.statusBadge, 
                    backgroundColor: tenant.isActive ? '#dcfce7' : '#fee2e2', 
                    color: tenant.isActive ? '#166534' : '#991b1b' 
                  }}>
                    {tenant.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button 
                    onClick={() => toggleTenantStatus(tenant._id, tenant.isActive)}
                    style={{ 
                      ...styles.button, 
                      backgroundColor: tenant.isActive ? '#ef4444' : '#10b981' 
                    }}
                  >
                    {tenant.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    padding: "40px 20px",
  },
  content: {
    width: "100%",
    maxWidth: "1000px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },
  statusBadge: {
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '20px',
    fontWeight: '700',
  },
  button: {
    width: '100%',
    padding: "10px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "opacity 0.2s",
  }
};