const Timesheet = require("../models/Timesheet");
const Rule = require("../models/Rule");
const { getAvgHours } = require("./HistoricalAnalysisService");
const { calculateRisk } = require("./RiskScoringEngine");

async function submitTimesheet(employee, entries) {
  // ✅ 1. Fetch rules
  let rules = await Rule.findOne();
  if (!rules) {
    rules = {
      maxHoursPerDay: 8,
      maxHoursPerWeek: 40,
      deviationThreshold: 5,
    };
  }

  // ✅ 2. Fetch past timesheets
  const pastTimesheets = await Timesheet.find({ employee })
    .sort({ createdAt: -1 })
    .limit(5);

  // ✅ 3. Historical avg
  const historicalAvg = getAvgHours(pastTimesheets);

  // ✅ 4. Risk calculation
  const risk = calculateRisk({ entries }, rules, historicalAvg);
  const status = risk <= 20 ? "Approved" : "Pending";

  // ✅ 5. Week calculation
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

  // ✅ 6. Deviation calculation
  const total = entries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const currentAvg = total / entries.length;
  let deviation = 0;

    if (historicalAvg === 0) {
      deviation = 0;
    } else {
      deviation = Math.abs(currentAvg - historicalAvg);
    }

  // ✅ 7. Save
  const newTS = new Timesheet({
    employee,
    entries,
    risk,
    status,
    week: getCurrentWeek(),
    historicalAvg,
    deviation,
  });

  await newTS.save();

  return newTS;
}

module.exports = { submitTimesheet };