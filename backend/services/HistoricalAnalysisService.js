function getAvgHours(timesheets) {
  let totalHours = 0;
  let totalDays = 0;

  timesheets.forEach(ts => {
    ts.entries.forEach(e => {
      totalHours += e.hours || 0;
      totalDays++;
    });
  });

  return totalDays === 0 ? 0 : totalHours / totalDays;
}

module.exports = { getAvgHours };