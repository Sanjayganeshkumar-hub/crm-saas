const express = require("express");
const Lead = require("../models/lead");
const router = express.Router();

// ADD LEAD
router.post("/", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});

// GET ALL LEADS
router.get("/", async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

// UPDATE STAGE
router.put("/:id", async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { stage: req.body.stage },
    { new: true }
  );
  res.json(lead);
});

// DELETE LEAD ✅
router.delete("/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Lead deleted" });
});

module.exports = router;
