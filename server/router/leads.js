const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");
const authMiddleware = require("./middleware");

/* CREATE LEAD (ONLY FOR LOGGED-IN USER) */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const lead = new Lead({
            ...req.body,
            user: req.user.userId
        });
        await lead.save();
        res.json(lead);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Add lead failed" });
    }
});

/* GET USER LEADS */
router.get("/", authMiddleware, async (req, res) => {
    const leads = await Lead.find({ user: req.user.userId });
    res.json(leads);
});

/* UPDATE STAGE */
router.put("/:id", authMiddleware, async (req, res) => {
    await Lead.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        { stage: req.body.stage }
    );
    res.json({ success: true });
});

/* DELETE LEAD */
router.delete("/:id", authMiddleware, async (req, res) => {
    await Lead.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId
    });
    res.json({ success: true });
});

module.exports = router;
