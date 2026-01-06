require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connecterDB = require("./config/db");

connecterDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/status", (req,res) => res.json({ message:"Backend OK 🚀" }));

app.use("/api/tasks", require("./routes/task.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Serveur lancé sur port", PORT));
