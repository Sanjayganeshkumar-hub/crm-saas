require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", require("./router/auth"));
app.use("/api/leads", require("./router/leads"));

// ================= STATIC FILES =================
// VERY IMPORTANT: static AFTER API
app.use(express.static(path.join(__dirname, "../public")));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("CRM SaaS Backend Running");
});

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
