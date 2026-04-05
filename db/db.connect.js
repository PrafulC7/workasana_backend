const mongoose = require("mongoose")
const dns = require("dns")
dns.setServers(["1.1.1.1", "8.8.8.8"])
require("dotenv").config();
const mongoUri = process.env.MONGODB
let isConnected = false;
const initializeDatabase = async () => {
  if (isConnected) {
    console.log("Using existing DB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);

    isConnected = conn.connections[0].readyState === 1;
    console.log("Connected to Database");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};
module.exports = { initializeDatabase }