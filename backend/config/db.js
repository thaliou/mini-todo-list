const mongoose = require("mongoose");

const connecterDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté ✅");
  } catch (error) {
    console.error("Erreur MongoDB ❌", error);
    process.exit(1);
  }
};

module.exports = connecterDB;
