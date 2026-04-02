const mongoose = require("mongoose")
const dns = require("dns")
dns.setServers(["1.1.1.1", "8.8.8.8"])
require("dotenv").config();
const mongoUri = process.env.MONGODB
const initializeDatabase = async () => {
    try{
await mongoose.connect(mongoUri);
    console.log("Connected to Database");
}catch(error){
    console.log("Error connecting to database", error)
    }
};
module.exports = { initializeDatabase }