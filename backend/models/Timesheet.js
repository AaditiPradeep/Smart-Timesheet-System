const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  day: String,
  hours: Number,
  description: String,
});

const timesheetSchema = new mongoose.Schema({
  employee: String,
  entries: [entrySchema],
  risk: Number,
  status: String,
  week: String,
  historicalAvg: Number,
  deviation: Number,
});

module.exports = mongoose.model("Timesheet", timesheetSchema);