// models/Rule.js
const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  maxHoursPerDay: Number,
  maxHoursPerWeek: Number,
  deviationThreshold: Number,
});

module.exports = mongoose.model("Rule", ruleSchema);