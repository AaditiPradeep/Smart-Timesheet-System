import "./styles/dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [timesheets, setTimesheets] = useState([]);
  const navigate = useNavigate();
  
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUsername = user.username || "User";

  // ✅ CURRENT WEEK
  const getCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const options = { month: "short", day: "numeric" };

    return `${monday.toLocaleDateString("en-US", options)} – ${sunday.toLocaleDateString("en-US", options)}`;
  };

  const currentWeek = getCurrentWeek();

  // ✅ FETCH DATA - Filter by current user
  useEffect(() => {
    axios
      .get(`${API}/timesheets`)
      .then((res) => {
        const userTimesheets = res.data.filter(
          (t) => t.employee === currentUsername
        );
        setTimesheets(userTimesheets);
      })
      .catch((err) => console.error(err));
  }, [currentUsername]);

  // ✅ CALCULATIONS
  const totalSubmitted = timesheets.length;
  const approved = timesheets.filter((t) => t.status === "Approved").length;
  const pending = timesheets.filter((t) => t.status === "Pending").length;

  const avgRisk =
    timesheets.length > 0
      ? (
          timesheets.reduce((sum, t) => sum + (t.risk || 0), 0) /
          timesheets.length
        ).toFixed(1)
      : 0;

  // ✅ Risk Category
  const getRiskCategory = (risk) => {
    if (risk <= 20) return "Low";
    if (risk <= 50) return "Medium";
    return "High";
  };

  return (
    <div>
      {/* NAV */}
      <div className="nav">
        <span>Smart Timesheet Validation & Approval System</span>
        <span className="nav-role">Role: Employee</span>
      </div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          {/* ✅ FIXED THE STYLE ERROR BELOW */}
          <div style={{ fontSize: "26px", fontWeight: "bold" }}>
            Employee Dashboard
          </div>
          <div style={{ color: "#64748b" }}>
            Welcome, {currentUsername}
          </div>
        </div>

        <button
          className="btn-submit-new"
          onClick={() => navigate("/submit")}
        >
          Submit New Timesheet
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "28px 40px" }}>
        {/* SUMMARY */}
        <div style={{ display: "flex", gap: "18px", marginBottom: "28px" }}>
          <div className="summary-box">
            <div>Total Timesheets Submitted</div>
            <div className="summary-value">{totalSubmitted}</div>
          </div>
          <div className="summary-box">
            <div>Approved This Month</div>
            <div className="summary-value">{approved}</div>
          </div>
          <div className="summary-box">
            <div>Pending Reviews</div>
            <div className="summary-value">{pending}</div>
          </div>
          <div className="summary-box">
            <div>Average Risk Score</div>
            <div className="summary-value">{avgRisk}</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-section">
          <div className="table-title">My Timesheets</div>
          <table className="data-table" width="100%">
            <thead>
              <tr>
                <th>Week</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* ✅ CURRENT WEEK DRAFT */}
              <tr>
                <td>{currentWeek}</td>
                <td>—</td>
                <td>Draft</td>
                <td>N/A</td>
                <td>—</td>
                <td>
                  <span
                    className="action-btn-primary"
                    onClick={() => navigate("/submit")}
                  >
                    Edit
                  </span>
                </td>
              </tr>

              {/* ✅ BACKEND DATA */}
              {timesheets.map((t) => {
                const total = t.entries ? t.entries.reduce(
                  (sum, e) => sum + (e.hours || 0),
                  0
                ) : 0;

                return (
                  <tr key={t._id}>
                    <td>{t.week}</td>
                    <td>{total}</td>
                    <td>{t.status}</td>
                    <td>{t.risk}</td>
                    <td>{getRiskCategory(t.risk)}</td>
                    <td>
                      <span className="action-btn">View</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer" style={{ padding: "16px 40px" }}>
        Employee Dashboard | Logged in as {currentUsername}
      </div>
    </div>
  );
}