const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  titre: String,
  complete: { type: Boolean, default: false },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);
