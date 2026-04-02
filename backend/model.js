const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true, // must provide task
      trim: true, // remove extra spaces
    },
    completed: {
      type: Boolean,
      default: false, // for future use (checkbox)
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

module.exports = mongoose.model("Task", TaskSchema);
