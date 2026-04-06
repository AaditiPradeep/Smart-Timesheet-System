import "./styles/theme.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.user.id);

        // Redirect based on role
        const roleRoutes = {
          employee: "/employee",
          manager: "/manager",
          admin: "/admin",
        };
        navigate(roleRoutes[data.user.role] || "/employee");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Please check if backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password || !email) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        alert("Signup successful! Please login now.");
        setIsSignup(false);
        setUsername("");
        setPassword("");
        setEmail("");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Connection error. Please check if backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Timesheet Validation System</h1>
      <p style={{ color: "gray" }}>Role-Based Secure Access</p>

      <div style={{
        width: "400px",
        margin: "auto",
        border: "2px solid #2C3E50",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>

        <h3>{isSignup ? "Create Account" : "Login"}</h3>

        {error && (
          <div style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
            disabled={loading}
          />

          {isSignup && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
              disabled={loading}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", boxSizing: "border-box" }}
            disabled={loading}
          />

          {isSignup && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "15px", boxSizing: "border-box" }}
              disabled={loading}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            className="btn-primary"
            type="submit"
            style={{ width: "100%", padding: "10px" }}
            disabled={loading}
          >
            {loading ? "Processing..." : (isSignup ? "Sign Up" : "Login")}
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setUsername("");
              setPassword("");
              setEmail("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#3498db",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px"
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
}