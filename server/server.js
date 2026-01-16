const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const authRoutes = require("./router/auth");
const leadRoutes = require("./router/leads");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/crm_saas")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

/* 🔽 SOCKET LOGIC MOVED HERE */
const socketHandler = require("./sockets/socket");
socketHandler(io);
/* 🔼 END SOCKET */

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
