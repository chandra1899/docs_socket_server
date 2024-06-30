require('dotenv').config()
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require('axios')

const httpServer = http.createServer();
  
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8000", "https://admin.socket.io", "https://personal-document.vercel.app/","https://personal-docs-142jxchn3-chandra1899s-projects.vercel.app/","https://hoppscotch.io/"], // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection",async  (socket) => {
  console.log('user connected', socket.id);
  socket.on('establish-conection',async (id)=>{
      console.log('connection established in room', id);
      socket.join(id)
      socket.emit("connection-established",{})
      socket.on("send-changes", async (delta) => {
        socket.broadcast.to(id).emit('receive-changes', delta)
      });
      socket.on('disconnect', () => {
        console.log('user leaft the room', id, 'with socket id', socket.id);
        socket.leave(id)
      })
    })
});

httpServer.listen(3001, () => {
  console.log(`Socket.io server is running on port ${3001}`);
});