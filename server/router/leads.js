const express = require("express");
const Lead = require("../models/lead");
const authMiddleware = require("./middleware");

const router = express.Router();

/* ================= CREATE LEAD ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      user: req.userId
    });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET USER LEADS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE STAGE ================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { stage: req.body.stage },
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE LEAD ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Lead.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
