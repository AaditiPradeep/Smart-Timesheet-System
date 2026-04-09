import "./styles/dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";

export default function AdminConfig() {
  const [rules, setRules] = useState({
    maxHoursPerDay: "",
    maxHoursPerWeek: "",
    deviationThreshold: "",
  });

  // ✅ FETCH CURRENT RULES
  useEffect(() => {
    axios.get(`${API}/rules`)
      .then((res) => {
        setRules(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (field, value) => {
    setRules({
      ...rules,
      [field]: value,
    });
  };

  // ✅ SAVE RULES
  const updateRules = async () => {
  try {
    const res = await axios.post(`${API}/rules`, {
      maxHoursPerDay: Number(rules.maxHoursPerDay),
      maxHoursPerWeek: Number(rules.maxHoursPerWeek),
      deviationThreshold: Number(rules.deviationThreshold),
    });

    console.log("Updated rules:", res.data);
    alert("Rules updated successfully!");

  } catch (err) {
    console.error(err);
    alert("Error updating rules");
  }
};

  return (
    <div className="page-container">

      <div className="nav">
        <span className="nav-title">
          Smart Timesheet Validation & Approval System
        </span>
        <span className="nav-role">Role: Admin</span>
      </div>


      <div className="content">

        <div className="section">
          <div className="section-title">Validation Rules</div>

          <div className="section-body">

            <div className="config-row">
              <label>Max Hours per Day</label>
              <input
                type="number"
                value={rules.maxHoursPerDay}
                onChange={(e) =>
                  handleChange("maxHoursPerDay", e.target.value)
                }
              />
            </div>

            <div className="config-row">
              <label>Max Hours per Week</label>
              <input
                type="number"
                value={rules.maxHoursPerWeek}
                onChange={(e) =>
                  handleChange("maxHoursPerWeek", e.target.value)
                }
              />
            </div>

            <div className="config-row">
              <label>Deviation Threshold</label>
              <input
                type="number"
                value={rules.deviationThreshold}
                onChange={(e) =>
                  handleChange("deviationThreshold", e.target.value)
                }
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                className="btn-submit"
                onClick={updateRules}
              >
                Save Configuration
              </button>
            </div>

          </div>
        </div>

      </div>


      <div className="footer">
        Admin Configuration Panel
      </div>

    </div>
  );
}
