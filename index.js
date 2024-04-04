require('dotenv').config()
// const fetch = require("node-fetch");
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

const findDocument = async (id)=>{
  if(id == null) return 
  try {
    let res = await fetch('http://localhost:8000/api/roomdetails',{
      method:'POST',
      headers:{
        'Access-Control-Allow-Origin': '*',
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      credentials:'include',
      body:JSON.stringify({
        roomName : id
      })
    })
    let data = await res.json();
    // console.log('data',data);
    if(res.status === 200)
    return data.document
  return {}
    
  } catch (error) {
    console.log("error", error);
  }
}

const updateDocument = async (id, content)=>{
  console.log(content);
  if(id == null) return 
  try {
    let res = await fetch('http://localhost:8000/api/savedocument',{
      method:'POST',
      headers:{
        'Access-Control-Allow-Origin': '*',
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      credentials:'include',
      body:JSON.stringify({
        roomName : id,content
      })
    })
    if(res.status === 200)
      console.log('saved');
    
  } catch (error) {
    console.log("error", error);
  }
}

io.on("connection",async  (socket) => {
    console.log("A user connected:", socket.id);
  
    socket.on('get_document',async (id)=>{
      const document = await findDocument(id)
      if(document == undefined) return 
      socket.join(id)
      let d = document.content
      // console.log('document from get_document', d);
      socket.emit("load_document", d)
      socket.on("send-changes", async (delta) => {
        socket.broadcast.to(id).emit('recieved_changes', delta)
      });
      socket.on("save_document", async (data) => {
        // console.log('data',data);
        await updateDocument(id, data)
      });
    })
});

httpServer.listen(3001, () => {
  console.log(`Socket.io server is running on port ${3001}`);
});