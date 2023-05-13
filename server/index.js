require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require("./services/harper-get-messages");
const leaveRoom = require("./leave-room");

app.use(cors()); // as middleware

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const CHAT_BOT = "ChatBot";
let chatRoom = ""; // chat rooms
let allUsers = []; // all users in the room

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // Add a user to the room
  socket.on("join_room", (data) => {
    const { userName, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room

    let __createdtime__ = Date.now(); // current time
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      message: `${userName} has joined the room`,
      userName: CHAT_BOT,
      __createdtime__,
    });

    // Send welcome msg to user that just joined chat only
    socket.emit("receive_message", {
      message: `Welcome @${userName}`,
      userName: CHAT_BOT,
      __createdtime__,
    });
    // Save the new user to the room
    chatRoom = room;
    allUsers.push({ id: socket.id, userName, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);

    // Get last 100 messages sent in the chat room
    harperGetMessages(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));
  });
  // send message in the room
  socket.on("send_message", (data) => {
    const { message, userName, room, __createdtime__ } = data;
    io.in(room).emit("receive_message", data); // Send to all users in room, including sender
    harperSaveMessage(message, userName, room, __createdtime__) // Save message in db
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  socket.on("typing", (data) => {
    const {userName, room} = data;
    socket.broadcast.emit("typing_message", {
      message : `${userName} is typing`
    })
  });

  // leave room event
  socket.on("leave_room", (data) => {
    const { userName, room, __createdtime__ } = data;
    socket.leave(room);
    // remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("leave_message", {
      userName: CHAT_BOT,
      message: `${userName} has left the room`,
      __createdtime__,
    });
  });
  // disconnected
  socket.on("disconnect", () => {
    console.log("User disconnected from the chat");
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.userName) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("receive_message", {
        message: `${user.userName} has disconnected from the chat.`,
      });
    }
  });
  
});
const port = process.env.PORT || 4000;
server.listen(port, () => `Server is is running on port ${port}`);
