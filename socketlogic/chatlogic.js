function socketFunction(socket,user) {
    //incoming message 
    socket.on("incoming-message",data=>{
        console.log(`${user["name"]} : ${data}`);
       boysData = data
        socket.broadcast.emit("broadcast-message",`${user["name"]}: ${boysData}`)
    })
   

}

module.exports = socketFunction