const express = require("express");
const { connectDb } = require("./connection");
const { logReqRes } = require("./middlewares/middleware");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chats");

const app = express();
const Port = 8000;

connectDb("mongodb://127.0.0.1:27017/chats");

app.use(logReqRes("log.txt"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);


app.listen(Port, () => console.log("server started"));
