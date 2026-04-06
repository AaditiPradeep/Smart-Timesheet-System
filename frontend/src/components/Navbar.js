import { useNavigate } from "react-router-dom";

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      background: "#2C3E50",
      color: "white",
      padding: "12px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>Smart Timesheet System</div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <span>{user.username} ({role})</span>
        <button
          onClick={handleLogout}
          style={{
            background: "#e74c3c",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}