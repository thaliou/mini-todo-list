const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth.middleware");

// Toutes les routes protégées
router.use(authMiddleware);

// Créer une tâche
router.post("/", async (req, res) => {
  const { titre, startTime, endTime } = req.body;

  const task = new Task({
    titre,
    startTime,
    endTime,
    userId: req.user.id
  });

  // Calculer le status initial
  const now = new Date();
  if (task.complete) task.status = "Complétée";
  else if (now < new Date(startTime)) task.status = "À venir";
  else if (now >= new Date(startTime) && now <= new Date(endTime)) task.status = "En cours";
  else task.status = "Non faite";

  await task.save();
  res.status(201).json(task);
});

// Lire toutes les tâches de l’utilisateur
router.get("/", async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Toggle complete + update status
router.put("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  // Vérifier que la tâche existe
  if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

  // Vérifier que c’est bien la tâche de l’utilisateur
  if (!task.userId.equals(req.user.id)) return res.status(403).json({ message: "Accès refusé" });

  task.complete = !task.complete;

  // Mettre à jour le status
  const now = new Date();
  if (task.complete) task.status = "Complétée";
  else if (now < new Date(task.startTime)) task.status = "À venir";
  else if (now >= new Date(task.startTime) && now <= new Date(task.endTime)) task.status = "En cours";
  else task.status = "Non faite";

  await task.save();
  res.json(task);
});

// Supprimer une tâche
router.delete("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  // Vérifier que la tâche existe
  if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

  // Vérifier que c’est bien la tâche de l’utilisateur
  if (!task.userId.equals(req.user.id)) return res.status(403).json({ message: "Accès refusé" });

  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé ✅" });
});

module.exports = router;
