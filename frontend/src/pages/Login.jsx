import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AppContext } from "../context/AppContext";
import Toast from "../components/Toast";
import { theme } from "../theme";

export default function Login() {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(AppContext);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "superadmin") navigate("/superadmin");
      else if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "driver") navigate("/driver");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <span style={styles.icon}>🚚</span>
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <Toast message={error} />}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              placeholder="Enter your phone number"
              required
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.secondary} 100%)`,
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: theme.colors.white,
    padding: "48px",
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.xl
  },
  header: {
    textAlign: "center",
    marginBottom: "32px"
  },
  iconWrapper: {
    display: "inline-flex",
    padding: "16px",
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    borderRadius: theme.radius.full,
    marginBottom: "16px"
  },
  icon: {
    fontSize: "32px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: theme.colors.gray900,
    marginBottom: "8px"
  },
  subtitle: {
    fontSize: "15px",
    color: theme.colors.gray600
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: theme.colors.gray700
  },
  input: {
    padding: "12px 16px",
    fontSize: "15px",
    border: `2px solid ${theme.colors.gray200}`,
    borderRadius: theme.radius.md,
    outline: "none",
    transition: "border-color 0.2s",
    ":focus": {
      borderColor: theme.colors.primary
    }
  },
  button: {
    padding: "14px",
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    border: "none",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "8px",
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows.lg
    }
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: theme.colors.gray600
  },
  link: {
    color: theme.colors.primary,
    textDecoration: "none",
    fontWeight: "600"
  }
};