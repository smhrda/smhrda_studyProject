"use strict"; // 엄격한 모드로 설정
const socket = io();

// DOM 가져오기
const nickname = document.querySelector("#nickname");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayContainer = document.querySelector(".display-container");
const image = document.getElementById("image");
let previewImage = document.getElementById("previewImage");

var chatLog = [];

// 보내기 기능
function send() {
  let param;

  if (previewImage.getAttribute("src") == null) {
    // 이미지 없음
    param = {
      name: nickname.value,
      msg: chatInput.value,
    };
  } else {
    // 이미지 있음
    param = {
      name: nickname.value,
      img: previewImage.getAttribute("src"),
      msg: chatInput.value,
    };
  }

  socket.emit("chatting", param); // 보내기

  // 초기화
  chatInput.value = "";
  previewImage.removeAttribute("src");
  image.value = "";
}

// 전송 버튼 클릭 시 전송
sendButton.addEventListener("click", (e) => send());
// 엔터 키 입력 시 전송
chatInput.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    send();
  }
});

socket.on("chatting", (data) => {
  const { name, msg, time, img } = data; //data 쪼개기(data.name, data.msg, data.time)
  const item = new LiModel(name, msg, time, img); //LiModel 인스턴스화
  item.makeLi();
  displayContainer.scrollTo(0, displayContainer.scrollHeight); // 스크롤을 항상 맨마지막으로
});

function LiModel(name, msg, time, img) {
  this.name = name;
  this.msg = msg;
  this.time = time;
  this.img = img;

  this.makeLi = () => {
    const li = document.createElement("li");
    //nickname값이 서버에서 넘겨받은 값과 같으면 클래스를 sent, 다르면 received로 설정
    li.classList.add(nickname.value === this.name ? "sent" : "received");
    if (this.img == null) {
      // 전송할 이미지가 있는 경우
      const dom = `<span class="profile">
        <span class="user">${this.name}</span>
        <img class="image" src="https://placeimg.com/50/50/any" alt="any">
        </span>
        <span class="message">${this.msg}</span>
        <span class="time">${this.time}</span>`;
      li.innerHTML = dom;
      chatList.appendChild(li);
    } else if (this.img != null) {
      // 전송할 이미지가 있는 경우 - 메세지는 미전송
      const dom = `<span class="profile">
        <span class="user">${this.name}</span>
        <img class="image" src="https://placeimg.com/50/50/any" alt="any">
        </span>
        <span class="time">${this.time}</span>
        <img src="${this.img}" id="userImage" />`;
      li.innerHTML = dom;
      chatList.appendChild(li);
    }
  };
}

function sendImage(event) {
  let file = image.files[0];
  let url = window.URL.createObjectURL(file);
  console.log(url);
  // 이미지 미리보기
  previewImage.src = url;
}
