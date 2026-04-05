const mongoose = require("mongoose")
const dns = require("dns")
dns.setServers(["1.1.1.1", "8.8.8.8"])
require("dotenv").config();
const mongoUri = process.env.MONGODB
const initializeDatabase = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGODB URI is missing");
    }

    await mongoose.connect(mongoUri);

    console.log("Connected to Database");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
};
module.exports = { initializeDatabase }