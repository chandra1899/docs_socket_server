require('dotenv').config()
// const fetch = require("node-fetch");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

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
    console.log("A user connected:", socket.id);
    // await socket.on('joinRoom', async (roomName,email) => {
    //   if(!email) return ;
    //   socket.email=email;
    //   socket.roomName=roomName
    //   await socket.join(roomName);
    //   console.log('room and email',roomName,email);
    // });
  
    socket.on('get_document',(id)=>{
      const data = ""
      socket.join(id)
      socket.emit("load_document", data)
      socket.on("send-changes", async (delta) => {
        // console.log(delta);
        socket.broadcast.to(id).emit('recieved_changes', delta)
      });
    })

  await socket.on("change", async (roomId, data) => {
      console.log("change", data);

      await io.to(roomId).emit("changed",data);
  });

  await socket.on("receive_draw_req", async (email,roomName) => {
    console.log("receive_draw_req");
      await io.to(roomName).emit("receive_draw_req",email);    
  });

  await socket.on("game_over", async (roomName,email) => {
    console.log("game_over");
      await io.to(roomName).emit("game_over",email);  
  });

  await socket.on("draw_accepted", async (email,roomName) => {
    console.log("draw_accepted");
      await io.to(roomName).emit("draw_accepted",email);    
  });

//   socket.on('disconnect', async function () {
//     let res=await fetch(`https://chessmastershub.vercel.app/api/setdisconnected`,{
//       method:'POST',
//       headers:{
//         'Access-Control-Allow-Origin': '*',
//         Accept:"application/json",
//         "Content-Type":"application/json"
//       },
//       credentials:'include',
//       body:JSON.stringify({
//         email:socket.email,
//         roomName:socket.roomName
//       })
//     })
//     if(res.status===200){
//       console.log(`${socket.email} is disconnected from ${socket.roomName}`);
//     }
//   });
});

httpServer.listen(3001, () => {
  console.log(`Socket.io server is running on port ${3001}`);
});