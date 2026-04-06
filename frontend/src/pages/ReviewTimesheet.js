import "./styles/dashboard.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";

export default function ReviewTimesheet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [timesheet, setTimesheet] = useState(null);
  const [comment, setComment] = useState("");

  // ✅ FETCH DATA
  useEffect(() => {
    axios.get(`${API}/timesheets`)
      .then(res => {
        const found = res.data.find(t => t._id === id);
        setTimesheet(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  // ✅ APPROVE / REJECT
  const handleAction = async (action) => {
    try {
      await axios.post(`${API}/review`, {
        id: id,
        action
      });

      alert(`Timesheet ${action}`);
      navigate("/manager");

    } catch (err) {
      console.error(err);
      alert("Error updating timesheet");
    }
  };

  if (!timesheet) return <div>Loading...</div>;

  // ✅ CALCULATIONS
  const totalHours = timesheet.entries.reduce(
    (sum, e) => sum + e.hours,
    0
  );

  const getRiskCategory = (risk) => {
    if (risk <= 20) return "LOW";
    if (risk <= 50) return "MEDIUM";
    return "HIGH";
  };

  return (
    <div className="page-container">

      {/* NAV */}
      <div className="nav">
        <span className="nav-title">
          Smart Timesheet Validation & Approval System
        </span>
        <span className="nav-role">Role: Manager</span>
      </div>

      {/* HEADER */}
      <div className="page-header">
        <div className="page-title">Timesheet Review</div>

        <div className="meta-row">
          <div className="meta-item">
            <b>Employee:</b> {timesheet.employee}
          </div>
          <div className="meta-item">
            <b>Week:</b> {timesheet.week || "—"}
          </div>
          <div className="meta-item">
            <b>Submitted:</b> —
          </div>
        </div>

        <div className="status-badge">
          Status: {timesheet.status}
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* 🔥 RISK */}
        <div className="section">
          <div className="section-title">Risk Assessment</div>

          <div className="section-body">
            <div className="risk-panel">

              <div className="risk-score-box">
                <div>RISK SCORE</div>
                <h1>{timesheet.risk}</h1>
              </div>

              <div className="risk-category-box">
                <div>CATEGORY</div>
                <h2>{getRiskCategory(timesheet.risk)}</h2>
              </div>

              <div className="risk-summary">
                <p>Auto-evaluated based on rules</p>
                <p>Historical Avg:{" "}
                  <b>{timesheet.historicalAvg?.toFixed(2) || "0"} hrs/day</b>
                </p>

                <p>Deviation:{" "}
                    <b>{timesheet.deviation?.toFixed(2) || "0"}</b>
                  </p>
                  {timesheet.deviation > 2 && (
    <p style={{ color: "red", marginTop: "10px" }}>
      🚨 Unusual work pattern detected
    </p>
  )}
              </div>

            </div>
          </div>
        </div>

        {/* 🔥 TABLE */}
        <div className="section">
          <div className="section-title">Timesheet Details</div>

          <div className="section-body">

            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Hours</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {timesheet.entries.map((e, i) => (
                  <tr key={i}>
                    <td>{e.day}</td>
                    <td>{e.hours}</td>
                    <td>{e.description || "-"}</td>
                  </tr>
                ))}

                <tr className="td-total">
                  <td>TOTAL</td>
                  <td>{totalHours} hrs</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

        {/* 🔥 VALIDATION (STATIC for now) */}
        <div className="section">
          <div className="section-title">Validation Breakdown</div>

          <div className="section-body two-subsec">

            <div className="subsec">
              <h4>Rule Violations</h4>
              <ul>
                <li>Check hours limits</li>
              </ul>
            </div>

            <div className="subsec">
              <h4>Anomalies</h4>
              <ul>
                <li>
            Deviation from normal: {timesheet.deviation?.toFixed(2)} hrs
          </li>

        {timesheet.deviation > 2 && (
          <li style={{ color: "red" }}>
            ⚠ Significant deviation from historical pattern
          </li>
        )}
              </ul>
            </div>

          </div>
        </div>

        {/* 🔥 DECISION */}
        <div className="section">
          <div className="section-title">Decision</div>

          <div className="section-body">

            <textarea
              placeholder="Enter review comment..."
              className="review-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="decision-buttons">
              <button
                className="btn-approve"
                onClick={() => handleAction("Approved")}
              >
                Approve
              </button>

              <button
                className="btn-reject"
                onClick={() => handleAction("Rejected")}
              >
                Reject
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="footer">
        <button
          className="btn-secondary"
          onClick={() => navigate("/manager")}
        >
          ← Back
        </button>

        <span>Timesheet ID: {id}</span>
      </div>

    </div>
  );
}