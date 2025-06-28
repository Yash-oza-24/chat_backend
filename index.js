require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./configuration/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/messageModel");
const http = require("http").Server(app);
// const httpServer = createServer(app);
const corsOptions = {
  origin: "*",
  // credentials: true,
  // optionSuccessStatus: 200,
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("Hello, server Connected");
});
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

socketIO.on("connect", (socket) => {
  console.log("A user connected: ", socket.id);
  socket.on("send_message", async (chat) => {
    try {
      // console.log(chat);
      const newChat = new Message({
        username: chat.username,
        groupId: chat.groupId,
        message: chat.message,
      });
      await newChat.save();
      socketIO.to(chat.groupId).emit("receive_message", newChat);
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  });
  socket.on("join_room", (data) => {
    try {
      // console.log("Joining room", data);
      const { groupId } = data;
      socket.join(groupId);
      // console.log("Joined room", groupId);
    } catch (error) {
      console.log("Error joining room", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
const start = async () => {
  try {
    await connectDB();

    http.listen(PORT, () => {
      console.log(`🚀 Server running on port http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log("🚀 Error connecting to mongoDB:" + e.message);
  }
};
app.use("/api/users", userRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/messages", messageRoutes);
start();
