const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// static 경로 설정
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord 관리자";

// 클라이언트 연결 시 실행
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // 환영 메세지 출력
    socket.emit(
      "message",
      formatMessage(botName, "ChatCord에 오신 것을 환영합니다!")
    );

    // 사용자가 연결 시 실행하는 broadcast 통신
    // broadcast : 모든 클라이언트에게 전달하는 emit()과 달리, 자신을 제외한 나머지 사용자들에게 이벤트를 전달함
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} 님이 참가하셨습니다.`)
      ); // 연결한 클라이언트를 제외한 모두에게 전달

    // 사용자와 채팅룸 정보 전달
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // chatMessage 받아서 전송하기
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // 클라이언트가 연결을 종료할 시
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} 님이 퇴장하셨습니다.`)
      );

      // 사용자와 채팅룸 정보 전달
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
