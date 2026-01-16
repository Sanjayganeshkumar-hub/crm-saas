const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  companyName: String,
  contactPerson: String,
  email: String,
  phone: String,
  dealValue: Number,
  stage: {
    type: String,
    enum: ["Lead", "Contacted", "Qualified", "Proposal", "Won", "Lost"],
    default: "Lead"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lead", leadSchema);
