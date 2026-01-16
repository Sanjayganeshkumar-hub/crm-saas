const express = require("express");
const Lead = require("../models/lead");
const authMiddleware = require("./middleware");

const router = express.Router();

// CREATE LEAD
router.post("/", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.create({
      companyName: req.body.companyName,
      contactPerson: req.body.contactPerson,
      email: req.body.email,
      phone: req.body.phone,
      dealValue: req.body.dealValue,
      stage: "Lead",
      user: req.user.userId
    });

    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Add lead failed" });
  }
});

// GET USER LEADS
router.get("/", authMiddleware, async (req, res) => {
  const leads = await Lead.find({ user: req.user.userId });
  res.json(leads);
});

module.exports = router;
