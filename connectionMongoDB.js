const mongoose = require("mongoose");

const connectionMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gozzde:jobb777.@cluster0.vjcug.mongodb.net/socket?retryWrites=true&w=majority&appName=Cluster0"
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectionMongoDB;
