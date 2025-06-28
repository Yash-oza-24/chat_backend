const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to the database", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
