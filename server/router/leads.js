const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");
const auth = require("./middleware");

/* ADD LEAD */
router.post("/", authMiddleware, async (req, res) => {
  const lead = new Lead({
    ...req.body,
    user: req.user.id
  });
  await lead.save();
  res.json(lead);
});


/* GET USER LEADS */
router.get("/", auth, async (req, res) => {
  const leads = await Lead.find({ userId: req.user.id });
  res.json(leads);
});

/* UPDATE STAGE */
router.put("/:id", auth, async (req, res) => {
  await Lead.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { stage: req.body.stage }
  );
  res.sendStatus(200);
});

/* DELETE LEAD */
router.delete("/:id", auth, async (req, res) => {
  await Lead.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  res.sendStatus(200);
});

module.exports = router;
