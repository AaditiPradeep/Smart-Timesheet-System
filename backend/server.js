const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// 1. Import Models FIRST
const Timesheet = require("./models/Timesheet");
const Rule = require("./models/Rule");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// 3. CONNECT DB & INITIALIZE
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const rules = await Rule.findOne() || {
            maxHoursPerDay: 8,
            maxHoursPerWeek: 40,
            deviationThreshold: 50
        };
        console.log("System Rules Initialized:", rules);

    } catch (err) {
        console.log("Database connection error ❌:", err.message);
        console.log("Retrying in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// 4. AUTH ROUTES

// Signup
app.post("/signup", async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        console.log(`Signup attempt: username=${username}, role=${role}`);

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            console.log(`Signup failed: User ${username} already exists`);
            return res.status(400).json({ error: "Username already exists" });
        }

        const newUser = new User({
            username,
            password,
            email: email || "",
            role: role || "employee",
        });

        await newUser.save();
        console.log(`User created successfully: ${username} (ID: ${newUser._id})`);

        res.status(201).json({
            message: "User created successfully",
            user: { id: newUser._id, username: newUser.username, role: newUser.role },
        });

    } catch (err) {
        console.error("Signup Error ❌:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// ✅ Login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`Login attempt: ${username}`);

        const user = await User.findOne({ username });
        if (!user) {
            console.log(`Login failed: User ${username} not found`);
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log(`Login failed: Incorrect password for ${username}`);
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log(`Login successful: Welcome ${username} (${user.role})`);
        res.json({
            message: "Login successful",
            user: { id: user._id, username: user.username, role: user.role },
        });

    } catch (err) {
        console.error("Login Error ❌:", err);
        res.status(500).json({ error: "Failed to login" });
    }
});

const { submitTimesheet } = require("./services/TimesheetService");

// Submit Timesheet
app.post("/submit", async (req, res) => {
  try {
    const { employee, entries } = req.body;
    console.log(`Receiving timesheet submission from: ${employee}`);
    console.log(`Entries count: ${entries ? entries.length : 0}`);

    const newTS = await submitTimesheet(employee, entries);
    
    console.log(`Timesheet saved! ID: ${newTS._id}, Risk: ${newTS.risk}, Status: ${newTS.status}`);
    res.json(newTS);

  } catch (err) {
    console.error("Submit Timesheet Error ❌:", err);
    res.status(500).json({ error: "Failed to submit timesheet" });
  }
});

// Get all Timesheets
app.get("/timesheets", async (req, res) => {
    try {
        const data = await Timesheet.find();
        console.log(`Fetching all timesheets. Total found: ${data.length}`);
        res.json(data);
    } catch (err) {
        console.error("Fetch Timesheets Error ❌:", err);
        res.status(500).json({ error: "Failed to fetch timesheets" });
    }
});

// Review Timesheet
app.post("/review", async (req, res) => {
    try {
        const { id, action } = req.body;
        console.log(`Review action: ${action} on Timesheet ID: ${id}`);

        const updated = await Timesheet.findByIdAndUpdate(
            id,
            { status: action },
            { new: true }
        );
        console.log(`Timesheet status updated to: ${updated.status}`);
        res.json(updated);
    } catch (err) {
        console.error("Review Error ❌:", err);
        res.status(500).json({ error: "Failed to review timesheet" });
    }
});


app.post("/rules", async (req, res) => {
    try {
        console.log("Updating system rules...", req.body);
        const { maxHoursPerDay, maxHoursPerWeek, deviationThreshold } = req.body;
        let rule = await Rule.findOne();

        if (rule) {
            rule.maxHoursPerDay = maxHoursPerDay;
            rule.maxHoursPerWeek = maxHoursPerWeek;
            rule.deviationThreshold = deviationThreshold;
            await rule.save();
            console.log("Existing rules updated");
        } else {
            rule = new Rule({ maxHoursPerDay, maxHoursPerWeek, deviationThreshold });
            await rule.save();
            console.log("New rules created");
        }
        res.json(rule);
    } catch (err) {
        console.error("Update Rules Error ❌:", err);
        res.status(500).json({ error: "Failed to save rules" });
    }
});

// ✅ Get Rules
app.get("/rules", async (req, res) => {
    try {
        console.log("Fetching current system rules...");
        const rule = await Rule.findOne();
        if (!rule) {
            console.log("No rules found in DB, returning defaults.");
            return res.json({
                maxHoursPerDay: 8,
                maxHoursPerWeek: 40,
                deviationThreshold: 10,
            });
        }
        res.json(rule);
    } catch (err) {
        console.error("Get Rules Error ❌:", err);
        res.status(500).json({ error: "Failed to fetch rules" });
    }
});

// ✅ Health Check
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// ✅ Start Server
app.listen(5000, () => {
    console.log("-----------------------------------------");
    console.log("Backend successfully started on port 5000");
    console.log(`Date: ${new Date().toLocaleString()}`);
    console.log("-----------------------------------------");
});