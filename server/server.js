require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./router/auth");
const leadRoutes = require("./router/leads");
const { MONGO_URI } = require("./config");

const app = express();

/* MIDDLEWARE */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

/* ROOT CHECK */
app.get("/", (req, res) => {
  res.send("CRM SaaS Backend Running");
});

/* DB CONNECT */
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

/* START SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
