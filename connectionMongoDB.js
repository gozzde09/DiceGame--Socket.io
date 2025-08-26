const mongoose = require("mongoose");
require("dotenv").config();

const connectionMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection error ❌", error);
    process.exit(1);
  }
};

module.exports = connectionMongoDB;
