import React, { useEffect, useState } from "react";
import "./styles/dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const ManagerDashboard = () => {
  const [timesheets, setTimesheets] = useState([]);

  // 🔥 FILTER STATES
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Highest");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // ✅ FETCH DATA
  useEffect(() => {
    axios
      .get(`${API}/timesheets`)
      .then((res) => {
        setTimesheets(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ HELPERS
  const getTotalHours = (entries) => {
    return entries.reduce((sum, e) => sum + e.hours, 0);
  };

  const getRiskCategory = (risk) => {
    if (risk <= 20) return "Low";
    if (risk <= 50) return "Medium";
    return "High";
  };

  // 🔥 APPLY FILTERS
  let filteredTS = [...timesheets];

  // status filter
  if (statusFilter !== "All") {
    filteredTS = filteredTS.filter(
      (t) => t.status === statusFilter
    );
  }

  // risk filter
  if (riskFilter !== "All") {
    filteredTS = filteredTS.filter(
      (t) => getRiskCategory(t.risk) === riskFilter
    );
  }

  // search filter
  if (search) {
    filteredTS = filteredTS.filter((t) =>
      t.employee.toLowerCase().includes(search.toLowerCase())
    );
  }

  // sorting
  filteredTS.sort((a, b) => {
    return sortOrder === "Highest"
      ? b.risk - a.risk
      : a.risk - b.risk;
  });

  // ✅ SUMMARY (based on filtered data)
  const totalPending = filteredTS.filter(
    (t) => t.status === "Pending"
  ).length;

  const high = filteredTS.filter((t) => t.risk > 50).length;
  const medium = filteredTS.filter(
    (t) => t.risk > 20 && t.risk <= 50
  ).length;
  const low = filteredTS.filter((t) => t.risk <= 20).length;

  return (
    <div className="page-container">

      {/* NAV BAR */}
      <div className="nav">
        <span className="nav-title">
          Smart Timesheet Validation & Approval System
        </span>
        <span className="nav-role">Role: Manager</span>
      </div>

      {/* HEADER */}
      <div className="page-header">
        <h2>Manager Dashboard</h2>
        <p>Timesheet Review Overview</p>
      </div>

      {/* SUMMARY */}
      <div className="summary-row">
        <div className="summary-box">
          <p>Total Pending Reviews</p>
          <h2>{totalPending}</h2>
        </div>

        <div className="summary-box">
          <p>High Risk Submissions</p>
          <h2>{high}</h2>
        </div>

        <div className="summary-box">
          <p>Medium Risk Submissions</p>
          <h2>{medium}</h2>
        </div>

        <div className="summary-box">
          <p>Low Risk Submissions</p>
          <h2>{low}</h2>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="filters">

          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
          </select>

          <select onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="Highest">Highest First</option>
            <option value="Lowest">Lowest First</option>
          </select>

          <input
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>
      </div>

      {/* TABLE */}
      <div className="table-section">
        <h3>Timesheet Reviews</h3>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Week</th>
              <th>Total Hours</th>
              <th>Risk Score</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTS.map((t) => {
              const total = getTotalHours(t.entries);
              const category = getRiskCategory(t.risk);

              return (
                <tr
                  key={t._id}
                  className={t.risk > 50 ? "high-row" : ""}
                >
                  <td>{t.employee}</td>
                  <td>{t.week || "—"}</td>
                  <td>{total} hrs</td>
                  <td>{t.risk}</td>
                  <td className={category.toLowerCase()}>
                    {category}
                  </td>
                  <td>{t.status}</td>
                  <td>
                    <button onClick={() => navigate(`/review/${t._id}`)}>
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default ManagerDashboard;