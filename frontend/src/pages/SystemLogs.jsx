import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState("all");

  useEffect(() => {
    api.get("/logs")
      .then(res => setLogs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const clearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all system logs? This action cannot be undone.")) return;
    
    try {
      await api.delete("/logs");
      setLogs([]);
      alert("Logs cleared successfully");
    } catch (err) {
      alert("Failed to clear logs");
    }
  };

  const uniqueTenants = Array.from(new Set(logs.map(log => log.tenant?._id).filter(Boolean)))
    .map(id => logs.find(log => log.tenant?._id === id).tenant);

  const filteredLogs = logs.filter(log => {
    if (selectedTenant === "all") return true;
    return log.tenant?._id === selectedTenant;
  });

  const downloadLogs = () => {
    if (filteredLogs.length === 0) return;

    const headers = ["Timestamp", "Method", "Status", "URL", "Message", "Tenant", "User"];
    const csvRows = [
      headers.join(","),
      ...filteredLogs.map(log => [
        new Date(log.createdAt).toLocaleString(),
        log.method,
        log.statusCode,
        log.url,
        `"${log.message.replace(/"/g, '""')}"`, // Escape quotes and wrap in quotes for CSV
        log.tenant?.name || 'N/A',
        log.user?.name || 'Guest'
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `system_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={styles.title}>System Error Logs</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            {filteredLogs.length > 0 && <button onClick={downloadLogs} style={styles.downloadButton}>Download Logs (CSV)</button>}
            {logs.length > 0 && <button onClick={clearLogs} style={styles.clearButton}>Clear All Logs</button>}
          </div>
        </div>
        <p style={styles.subtitle}>Monitoring the last 100 API errors across all tenants</p>

        <div style={styles.filterBar}>
          <select 
            style={styles.selectInput}
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
          >
            <option value="all">All Tenants</option>
            {uniqueTenants.map(tenant => (
              <option key={tenant._id} value={tenant._id}>{tenant.name}</option>
            ))}
          </select>
        </div>

        {loading ? <p>Loading logs...</p> : (
          <div style={styles.logList}>
            {filteredLogs.length === 0 ? <p>No errors found for the selected criteria.</p> : filteredLogs.map(log => (
              <div key={log._id} style={styles.logCard}>
                <div style={styles.logHeader}>
                  <span style={{ 
                    ...styles.method, 
                    backgroundColor: log.statusCode >= 500 ? '#fee2e2' : '#fef3c7',
                    color: log.statusCode >= 500 ? '#991b1b' : '#92400e'
                  }}>
                    {log.method} {log.statusCode}
                  </span>
                  <span style={styles.timestamp}>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <p style={styles.url}><strong>Path:</strong> {log.url}</p>
                <p style={styles.message}><strong>Error:</strong> {log.message}</p>
                <div style={styles.meta}>
                  <span>Tenant: {log.tenant?.name || 'N/A'}</span>
                  <span>User: {log.user?.name || 'Guest'}</span>
                </div>
                {log.stack && (
                  <details style={styles.details}>
                    <summary style={styles.summary}>View Stack Trace</summary>
                    <pre style={styles.stack}>{log.stack}</pre>
                  </details>
                )}
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
    background: "#f9fafb",
    padding: "40px 20px",
  },
  content: { width: "100%", maxWidth: "900px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 10px 0" },
  downloadButton: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  clearButton: {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  subtitle: { color: "#6b7280", marginBottom: "30px" },
  logList: { display: "flex", flexDirection: "column", gap: "15px" },
  filterBar: {
    marginBottom: '20px',
  },
  selectInput: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px'
  },
  logCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
  },
  logHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  method: { fontSize: "0.75rem", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" },
  timestamp: { fontSize: "0.85rem", color: "#9ca3af" },
  url: { fontSize: "0.9rem", margin: "5px 0", color: "#374151" },
  message: { fontSize: "1rem", color: "#b91c1c", fontWeight: "500", margin: "10px 0" },
  meta: { display: "flex", gap: "20px", fontSize: "0.85rem", color: "#6b7280", marginTop: "10px" },
  details: { marginTop: "15px", borderTop: "1px solid #f3f4f6", paddingTop: "10px" },
  summary: { fontSize: "0.85rem", cursor: "pointer", color: "#2563eb" },
  stack: { 
    fontSize: "0.75rem", 
    background: "#f3f4f6", 
    padding: "10px", 
    borderRadius: "4px", 
    overflowX: "auto",
    marginTop: "10px",
    color: "#4b5563"
  }
};