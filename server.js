const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const formatMessage=require('./utils/messages');
const {
    userJoin,
    getCurrentUser,userLeave,
    getRoomUsers
    }=require('./utils/users');
const { emit } = require('process');


const app=express();
const server= http.createServer(app);
const io=socketio(server);

//set static folder
app.use(express.static(path.join(path.join(__dirname,'public'))));

const botName = 'ConnectUs Bot';

//run when a client connects

io.on('connection',(socket)=>{
    // console.log("New WS Connection...");
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room);       
         socket.join(user.room);

        //Welcome current user
        socket.emit('message',formatMessage(botName,`Welcome to ConnectUs, ${user.username}!`));//will emit only to the user

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));//this will notify everyone except the user

          //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    });


    //listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));

    //runs when client disconnects
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));//to broadcast to everyone

             //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });

        }

        
    });
    })
})



const port = 3000 || process.env.PORT;



server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});