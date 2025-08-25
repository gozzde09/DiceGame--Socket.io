const mongoose = require("mongoose");
require("dotenv").config();

const connectionMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gozzde:jobb777.@cluster0.vjcug.mongodb.net/socket?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection error ❌", error);
    process.exit(1);
  }
};

module.exports = connectionMongoDB;
