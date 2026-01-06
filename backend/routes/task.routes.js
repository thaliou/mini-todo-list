const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Créer une tâche
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

// Lire toutes les tâches
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Mettre à jour une tâche (toggle complete)
router.put("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.complete = !task.complete;
  await task.save();
  res.json(task);
});

// Supprimer une tâche
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé ✅" });
});

module.exports = router;
