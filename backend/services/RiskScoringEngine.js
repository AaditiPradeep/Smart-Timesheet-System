function calculateRisk(timesheet, rules, historicalAvg) {
  if (!timesheet.entries || timesheet.entries.length === 0) return 0;

  let total = timesheet.entries.reduce(
    (sum, e) => sum + (e.hours || 0),
    0
  );

  let risk = 0;

  if (total > rules.maxHoursPerWeek) risk += 30;

  timesheet.entries.forEach((e) => {
    if ((e.hours || 0) > rules.maxHoursPerDay) risk += 10;
  });

  // 🔥 Pattern deviation
  const currentAvg = total / timesheet.entries.length;
  const deviation = Math.abs(currentAvg - historicalAvg);

  if (deviation > rules.deviationThreshold) {
    risk += 25;
  }

  return Math.min(risk, 100);
}

module.exports = { calculateRisk };