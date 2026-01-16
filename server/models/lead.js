const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    companyName: String,
    contactPerson: String,
    email: String,
    phone: String,
    dealValue: Number,
    status: {
        type: String,
        default: "Lead"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);
