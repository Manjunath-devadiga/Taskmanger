const express = require("express");
const cors = require("cors");
const path = require("path");
const Task = require("./model");
const connectDB = require("./db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ================= API ROUTES =================

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Task text is required" });
    }

    const newTask = new Task({ text });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Invalid ID or server error" });
  }
});

// UPDATE task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { text, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { text, completed },
      { new: true },
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= FRONTEND (React Build) =================

// Serve React static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// ✅ FIXED (no "*" error)
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// ================= SERVER START =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
