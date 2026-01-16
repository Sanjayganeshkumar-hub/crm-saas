require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { MONGO_URI } = require("./config");

const app = express();
const leadsRoutes = require("./router/leads");
app.use("/api/leads", leadsRoutes);

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./router/auth"));
app.use("/api/leads", require("./router/leads"));

app.get("/", (req, res) => {
  res.send("CRM SaaS Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
