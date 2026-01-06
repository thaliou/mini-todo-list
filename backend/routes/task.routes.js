const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth.middleware");

// Toutes les routes protégées
router.use(authMiddleware);

// ======================
// CRÉER UNE TÂCHE
// ======================
router.post("/", async (req, res) => {
  const { titre, startTime, endTime } = req.body;

  const task = new Task({
    titre,
    startTime,
    endTime,
    userId: req.user.id
  });

  // Calcul du status initial
  const now = new Date();
  if (task.complete) task.status = "Complétée";
  else if (now < new Date(startTime)) task.status = "À venir";
  else if (now >= new Date(startTime) && now <= new Date(endTime)) task.status = "En cours";
  else task.status = "Non faite";

  await task.save();
  res.status(201).json(task);
});

// ======================
// LISTER LES TÂCHES (AVEC FILTRE + RECALCUL)
// ======================
router.get("/", async (req, res) => {
  const filtre = { userId: req.user.id };

  if (req.query.status) {
    filtre.status = req.query.status;
  }

  const tasks = await Task.find(filtre).sort({ startTime: 1 });
  const now = new Date();

  for (let task of tasks) {
    let nouveauStatus = task.status;

    if (task.complete) nouveauStatus = "Complétée";
    else if (now < task.startTime) nouveauStatus = "À venir";
    else if (now >= task.startTime && now <= task.endTime) nouveauStatus = "En cours";
    else if (now > task.endTime) nouveauStatus = "Non faite";

    if (nouveauStatus !== task.status) {
      task.status = nouveauStatus;
      await task.save();
    }
  }

  res.json(tasks);
});

// ======================
// TOGGLE COMPLETE
// ======================
router.put("/:id", async (req, res) => {
  // Vérifier ID valide
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
  if (!task.userId.equals(req.user.id)) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  task.complete = !task.complete;

  const now = new Date();
  if (task.complete) task.status = "Complétée";
  else if (now < task.startTime) task.status = "À venir";
  else if (now >= task.startTime && now <= task.endTime) task.status = "En cours";
  else task.status = "Non faite";

  await task.save();
  res.json(task);
});

// ======================
// SUPPRIMER UNE TÂCHE
// ======================
router.delete("/:id", async (req, res) => {
  // Vérifier ID valide
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
  if (!task.userId.equals(req.user.id)) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé ✅" });
});

module.exports = router;
