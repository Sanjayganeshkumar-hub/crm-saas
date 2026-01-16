const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");
const authMiddleware = require("./middleware"); // ✅ REQUIRED

// ➕ Add Lead (USER-SPECIFIC)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const lead = new Lead({
            companyName: req.body.companyName,
            contactPerson: req.body.contactPerson,
            email: req.body.email,
            phone: req.body.phone,
            dealValue: req.body.dealValue,
            status: "Lead",
            user: req.user.id   // 🔐 VERY IMPORTANT
        });

        await lead.save();
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: "Add lead failed" });
    }
});

// 📥 Get ONLY logged-in user's leads
router.get("/", authMiddleware, async (req, res) => {
    const leads = await Lead.find({ user: req.user.id });
    res.json(leads);
});

// 🔄 Update status
router.put("/:id", authMiddleware, async (req, res) => {
    const lead = await Lead.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { status: req.body.status },
        { new: true }
    );
    res.json(lead);
});

// ❌ Delete lead
router.delete("/:id", authMiddleware, async (req, res) => {
    await Lead.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    });
    res.json({ success: true });
});

module.exports = router;
