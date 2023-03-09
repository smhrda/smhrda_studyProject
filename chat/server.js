const express = require("express");
const http = require("http");
const app = express();
const path = require("path");

const server = http.createServer(app); //express가 http를 통해 실행될 수 있도록 함
const socketIO = require("socket.io");
const io = socketIO(server);

const moment = require("moment");

app.use(express.static(path.join(__dirname, "src")));
const PORT = process.env.PORT || 5002;

io.on("connection", (socket) => {
  //connection이 이루어졌을 때 관련 정보를 socket에 담음
  socket.on("chatting", (data) => {
    const { name, msg, img } = data;
    io.emit("chatting", {
      name: name,
      msg: msg,
      time: moment(new Date()).format("h:mm A"),
      img: img,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
