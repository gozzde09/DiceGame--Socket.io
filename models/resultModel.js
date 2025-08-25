const mongoose = require("mongoose")

const ResultSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  kastNummer: {
    type: Number,
    required: true,
  },
  kastPoang: {
    type: Number,
    required: true,
  },
  totalPoang: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports =  mongoose.model("Result", ResultSchema)
