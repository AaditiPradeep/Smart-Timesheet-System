import "./styles/dashboard.css";
import { useState } from "react";
import axios from "axios";
import API from "../api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function SubmitTimesheet() {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUsername = user.username || "User";
  const navigate = useNavigate();
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [rules, setRules] = useState({
  maxHoursPerDay: 10,
  maxHoursPerWeek: 60,
});


useEffect(() => {
  axios.get(`${API}/rules`)
    .then(res => {
      setRules({
        maxHoursPerDay: res.data.maxHoursPerDay || 10,
        maxHoursPerWeek: res.data.maxHoursPerWeek || 60,
      });
    })
    .catch(err => console.error(err));
}, []);

  
  // ✅ CURRENT WEEK (FIXED)
  const getCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay() || 7; // Sunday fix

    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options = { month: "short", day: "numeric" };

    return `${monday.toLocaleDateString(
      "en-US",
      options
    )} – ${sunday.toLocaleDateString("en-US", options)}`;
  };

  const currentWeek = getCurrentWeek();

  // ✅ STATE
  const [entries, setEntries] = useState(
    days.map((day) => ({
      day,
      hours: "",
      description: "",
    }))
  );

  // ✅ HANDLE INPUT
  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  // ✅ TOTAL HOURS
  const totalHours = entries.reduce(
    (sum, e) => sum + Number(e.hours || 0),
    0
  );

  // ✅ VALIDATION
  const warnings = [];

  entries.forEach((e, i) => {
    if (Number(e.hours) > rules.maxHoursPerDay){
      warnings.push(`${e.day}: Exceeds ${rules.maxHoursPerDay} hrs`);
    }
  });

  if (totalHours > rules.maxHoursPerWeek) {
    warnings.push(`Total exceeds ${rules.maxHoursPerWeek} hrs/week`);
  }

  // ✅ SUBMIT FUNCTION
  const submitTimesheet = async () => {
   /* if (warnings.length > 0) {
      alert("Fix validation errors before submitting");
      return;
    }*/

    try {
      const res = await axios.post(`${API}/submit`, {
        employee: currentUsername,
        entries: entries.map((e) => ({
          day: e.day,
          hours: Number(e.hours),
          description: e.description,
        })),
      });
      console.log("Submitted:", res.data);
      alert("Timesheet submitted successfully!");
      navigate("/employee");
    } catch (err) {
      console.error(err);
      alert("Error submitting timesheet");
    }
  };

  return (
    <div className="page-container">

      {/* NAV */}
      <div className="nav">
        <span className="nav-title">
          Smart Timesheet Validation & Approval System
        </span>
        <span className="nav-role">Role: Employee</span>
      </div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Submit Weekly Timesheet</div>
          <div className="page-subtitle">
            Enter your daily hours and task descriptions
          </div>
        </div>
        <div className="status-badge">Status: Draft</div>
      </div>

      {/* MAIN */}
      <div className="content-wrap">

        {/* LEFT */}
        <div className="main-col">

          {/* WEEK */}
          <div className="week-selector-row">
            <span className="week-label">Select Week:</span>
            <div className="week-dropdown">
              {currentWeek} ▼
            </div>
          </div>

          {/* TABLE */}
          <div className="table-section">
            <div className="table-title">Weekly Hours Entry</div>

            <table className="entry-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Hours</th>
                  <th>Task Description</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry, i) => (
                  <tr key={i}>
                    <td>
                      <div className="day-name">{entry.day}</div>
                      <div className="day-validation">
                        {Number(entry.hours) > rules.maxHoursPerDay && `Exceeds ${rules.maxHoursPerDay} hrs/day`}
                      </div>
                    </td>

                    <td>
                      <input
                        className="input-hours"
                        placeholder="0.0"
                        value={entry.hours}
                        onChange={(e) =>
                          handleChange(i, "hours", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="input-desc"
                        placeholder="Enter task..."
                        value={entry.description}
                        onChange={(e) =>
                          handleChange(i, "description", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}

                {/* TOTAL */}
                <tr className="tr-total">
                  <td>TOTAL</td>
                  <td>{totalHours} hrs</td>
                  <td></td>
                </tr>

              </tbody>
            </table>
          </div>

          <div className="helper-text-box">
          <div className="helper-item">
            Max {rules.maxHoursPerDay} hrs/day
          </div>
          <div className="helper-item">
            Max {rules.maxHoursPerWeek} hrs/week
          </div>
          <div className="helper-item">
            Description required
          </div>
        </div>

          {/* BUTTONS */}
          <div className="bottom-actions">
            <button className="btn-draft">Save Draft</button>
            <button className="btn-submit" onClick={submitTimesheet}>
              Submit
            </button>
          </div>

          <div className="submit-note">
            Submission triggers validation and risk scoring
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          <div className="validation-box">
            <div className="validation-title">Validation Preview</div>

            <div className="validation-body">

              <div className="vp-item">
                <div className="vp-label">Total Hours</div>
                <div className="vp-value">{totalHours} hrs</div>
              </div>

              <div className="vp-warnings">
                <div className="vp-warnings-label">Warnings</div>

                <div>
                  {warnings.length === 0
                    ? "No warnings"
                    : warnings.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              </div>

              <div className="vp-item">
                <div className="vp-label">Risk Level</div>
                <div className="vp-value">—</div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="footer">
        <span>Employee Timesheet</span>
        <span>Week: {currentWeek}</span>
      </div>

    </div>
  );
}