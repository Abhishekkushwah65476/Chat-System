const express = require("express")
const app = express()
const http = require("http");
const cors = require("cors")
const {Server} = require("socket.io")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type"]
    },
});

io.on("connection",(socket)=>{
    console.log(`User Connected : ${socket.id}`)

    socket.on("connect_error", (error) => {
        console.error("Connection Error:", error);
    });

    socket.on("error", (error) => {
        console.error("Socket Error:", error);
    });

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with Id: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message",(data)=>{
          console.log("Message received:", data);
          
          io.in(data.room).emit("receive_message", data);
    }) 
   

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
})

server.listen(3001,()=>{console.log("server running")})