const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const socketIO = require('socket.io')(httpServer);
let connectedUsers = {};

app.use(express.static(__dirname + "/view"));

socketIO.on('connection', function(client) {

    client.on('disconnect', function(){
        
        let userInfo = connectedUsers[client.id];

        if (typeof userInfo !== 'undefined') {
            client.leave(connectedUsers[client.id]);
            socketIO.emit('message',{
                username: 'System',
                text: userInfo.username + ' has left!'
            });
            delete connectedUsers[client.id];
        }
       
    });

    client.on('joinRoom', function(req, callback){
        
        if(req.room.replace(/\s/g, "").length > 0 && req.username.replace(/\s/g, "").length > 0){
            
            let nameTaken = false;
            
            Object.keys(connectedUsers).forEach(function(socketId){
                
                let userInfo = connectedUsers[socketId];
                
                if(userInfo.username.toUpperCase() === req.username.toUpperCase()){
                    nameTaken = true;
                }
            });
            if(nameTaken){
                callback({
                    nameAvail: false,
                    error: "This name is already taken!"
                });
            } else{ 
                connectedUsers[client.id] = req; 
                client.join(req.room);
                client.broadcast.to(req.room).emit('message', {
                    username: 'System',
                    text: req.username + ' has joined!'
                });
                callback({
                    nameAvail: true
                });
            }
        } else{
            callback({
                nameAvail: false,
                error: "Form's not completed yet..."
            });
        }
    })
    
    client.on('message', function(msg){
        socketIO.emit("message", msg);
    });
    
    client.emit('message', {
        username: 'System',
        text: "Hey there! Ask someone to join the chat room."
    })
    

});

httpServer.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
})
