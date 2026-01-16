const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");
const authMiddleware = require("./middleware");

// CREATE LEAD
router.post("/", authMiddleware, async (req, res) => {
  try {
    const lead = new Lead({
      company: req.body.company,
      contactPerson: req.body.contactPerson,
      email: req.body.email,
      phone: req.body.phone,
      value: req.body.value,
      stage: "Lead",
      user: req.user.id
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add lead" });
  }
});

// GET LEADS (USER SPECIFIC)
router.get("/", authMiddleware, async (req, res) => {
  const leads = await Lead.find({ user: req.user.id });
  res.json(leads);
});

module.exports = router;
