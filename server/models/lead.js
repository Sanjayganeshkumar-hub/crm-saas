const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
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

module.exports = mongoose.model("Lead", LeadSchema);
