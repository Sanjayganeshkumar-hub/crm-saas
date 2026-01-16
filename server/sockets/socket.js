module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("CRM user connected");

    socket.on("leadChanged", () => {
      io.emit("refreshLeads");
    });
  });
};
