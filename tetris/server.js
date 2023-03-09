const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const path = require("path");

const router = require("./src/router.js");

app.set("src", __dirname + "src");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static("src"));

// 라우터 적용
app.use("/", router);
app.use("/setRanking", router);
app.use("/rankBoard.html", router);

io.on("connection", (socket) => {
  socket.on("join", () => {
    console.log("Client has connected");
    console.log(socket);
  });
  socket.on("disconnect", () => {
    console.log("Client has disconnected");
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
