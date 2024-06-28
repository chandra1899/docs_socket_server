require('dotenv').config()
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require('axios')

const httpServer = http.createServer();
  
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8000", "https://admin.socket.io"], // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection",async  (socket) => {
    socket.on('establish-conection',async (id)=>{
      socket.join(id)
      socket.emit("connection-established",{})
      socket.on("send-changes", async (delta) => {
        socket.broadcast.to(id).emit('receive-changes', delta)
      });
    })
});

httpServer.listen(3001, () => {
  console.log(`Socket.io server is running on port ${3001}`);
});