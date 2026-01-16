const express = require("express");
const Lead = require("../models/lead");
const authMiddleware = require("./middleware");

const router = express.Router();

/* GET ONLY LOGGED-IN USER LEADS */
router.get("/", authMiddleware, async (req, res) => {
  const leads = await Lead.find({ userId: req.user.id });
  res.json(leads);
});

/* ADD NEW LEAD */
router.post("/", authMiddleware, async (req, res) => {
  const lead = new Lead({
    ...req.body,
    userId: req.user.id
  });

  await lead.save();
  res.json(lead);
});

/* UPDATE STAGE */
router.put("/:id", authMiddleware, async (req, res) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { stage: req.body.stage },
    { new: true }
  );

  res.json(lead);
});

/* DELETE LEAD */
router.delete("/:id", authMiddleware, async (req, res) => {
  await Lead.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  res.json({ success: true });
});

module.exports = router;
