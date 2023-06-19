const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// URL에서 사용자 이름, 방 이름 받아오기
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// 채팅방 입장 시 사용자 이름, 방 이름 전송
socket.emit("joinRoom", { username, room });

// 채팅방과 사용자 정보 받기
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// 서버에서 emit한 메세지 받기
socket.on("message", (message) => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤 내리기
});

// 메세지 전송
chatForm.addEventListener("submit", (e) => {
  e.preventDefault(); // 새로고침 방지

  // 메세지 text 가져오기
  let msg = e.target.elements.msg.value; // id가 msg인 요소의 value를 가져옴

  // 서버로 메세지 emit
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// DOM으로 메세지 더하는 함수
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message"); // message 클래스 부여
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// DOM에 채팅룸 이름 더하는 함수
function outputRoomName(room) {
  roomName.innerText = room;
}

// DOM에 사용자 리스트 더하는 함수
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
