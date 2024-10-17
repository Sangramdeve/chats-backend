const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { connectDb } = require("./connection");
const { logReqRes } = require("./middlewares/middleware");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chats");
const Conversation = require('./models/conversations'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const Port = 8000;
let users = {};

connectDb("mongodb://127.0.0.1:27017/chats");

app.use(logReqRes("log.txt"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);

// When a client connects
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Listen for user joining with their user ID
  socket.on("join", (userId) => {
    users[userId] = socket.id; // Store user and their socket ID
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  // Handle private message
  socket.on("private_message", async ({ senderId, receiverId, message, conversationId }) => {
    const receiverSocketId = users[receiverId];

    const newMessage = {
      sender_id: senderId,
      text: message,
      timestamp: Date.now(),
    };

    try {
      let conversation;

      if (conversationId) {
        // Find the conversation by the provided conversationId
        conversation = await Conversation.findById(conversationId);
        if (conversation) {
          // If conversation exists, add the new message to the messages array
          conversation.messages.push(newMessage);
          await conversation.save();
        } else {
          return console.log(`Conversation with ID ${conversationId} not found.`);
        }
      } else {
        // If no conversationId is provided, create a new one
        conversation = await Conversation.create({
          members: [senderId, receiverId],
          messages: [newMessage],
        });
      }

      if (receiverSocketId) {
        // Send the message to the receiver only
        io.to(receiverSocketId).emit("private_message", {
          senderId,
          message,
        });
      } else {
        console.log(`User ${receiverId} is not connected.`);
      }

      console.log("Message saved to conversation:", conversation);
    } catch (error) {
      console.error("Error handling private message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
    // Remove user from users object when they disconnect
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});


server.listen(Port, () => console.log("server started"));
