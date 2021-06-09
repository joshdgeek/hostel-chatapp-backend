const express = require("express")
const app =express()
const http = require("http")
const PORT = 8080
const cors = require("cors")
const socketFunction = require("./socketlogic/chatlogic") //import socketFunctonn from chatLogic

const server = http.createServer(app)
const {Server} = require("socket.io")
const io = new Server(server)
app.use(cors({
    origin:"http://127.0.0.1:5500"
}))

let user = {}

//update user details globally

io.on("connection", socket => {

    socket.on("data",data=>{
        user["name"] = data.name;
        console.log(data.name,socket.id)
    })
})


//boys
let boys = io.of("/boys")
boys.on("connection", socket=>{
    user[socket.id] = user['name']
    socket.broadcast.emit("newUser-alert", `${user[socket.id]} connected`)
    console.log(socket.id)
    socket.on("incoming-message",data=>{
        console.log(socket.id)
        console.log(`${user[socket.id]} : ${data}`);
        socket.broadcast.emit("broadcast-message",{name:`${user[socket.id]}`,message: data})
    })

    socket.on("typing", data=>{
        socket.broadcast.emit("typing-feed",`${user[socket.id]} is ${data}`)
    })

    socket.on("disconnect", ()=>{
        socket.broadcast.emit("disconnected",`${user[socket.id]} disconnected`)
        delete user[socket.id]
    })
})



//girls
let girls = io.of("/girls")
girls.on("connection",socket=>{
    socket.on("incoming-message",data=>{
        console.log(`${user["name"]} : ${data}`);
        socket.broadcast.emit("broadcast-message",`${user["name"]}: ${data}`)
    })
})  

let thePack = io.of("/thePack")
thePack.on("connection",socket=>{
    socket.on("incoming-message",data=>{
        console.log(`${user["name"]} : ${data}`);
        socket.broadcast.emit("broadcast-message",`${user["name"]}: ${data}`)
    })
})


server.listen(PORT,()=>{
    console.log(`server listen at ${PORT}`)
})

