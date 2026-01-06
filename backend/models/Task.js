const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  complete: { type: Boolean, default: false },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, default: "À venir" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);

