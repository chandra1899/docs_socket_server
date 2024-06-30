require('dotenv').config()
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require('axios')

const httpServer = http.createServer();
  
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8000", "https://admin.socket.io", "https://personal-document.vercel.app/"], // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection",async  (socket) => {
  console.log('user connected', socket);
  socket.on('establish-conection',async (id)=>{
      console.log('connection established in room', id);
      socket.join(id)
      socket.emit("connection-established",{})
      socket.on("send-changes", async (delta) => {
        socket.broadcast.to(id).emit('receive-changes', delta)
      });
      socket.on('disconnect', () => {
        console.log('user leaft the room', id, 'with socket', socket);
        socket.leave(id)
      })
    })
});

httpServer.listen(process.env.PORT || 3001, () => {
  console.log(`Socket.io server is running on port ${process.env.PORT || 3001}`);
});