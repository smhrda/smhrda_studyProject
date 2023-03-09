// Blocks
import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoredisplay = document.querySelector(".score");
const restartbutton = document.querySelector("#restart");
const setNicknameButton = document.querySelector("#setNickname");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem = {
  type: "tree",
  direction: 3,
  top: 0,
  left: 0,
};

init();

/* functions */
// 시작하기
function init() {
  score = 0;
  scoredisplay.innerText = 0; // 점수 초기화
  tempMovingItem = { ...movingItem }; //spread 사용해 값만 복사해 가져옴 -> 값이 변경되더라도 temp는 변경 X
  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
  }
  generateNewBlock();
}
// matrix 만들기
function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix); //prepend() : 선택된 요소 내부의 시작 부분에 삽입
  }
  li.prepend(ul);
  playground.prepend(li);
}

function renderBlocks(moveType = "") {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving"); // 클래스 삭제
  });
  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    // 칸을 벗어나는 경우 null로
    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);
    if (isAvailable) {
      target.classList.add(type, "moving"); // 해당 칸만 채우기 위해 moving 클래스 부여
    } else {
      tempMovingItem = { ...movingItem };
      if (moveType === "retry") {
        // retry가 다시 나온다면
        clearInterval(downInterval); // 인터벌을 멈추고
        showGameoverText(); // 게임오버 출력
      }
      setTimeout(() => {
        // 콜스택 에러 방지를 위해 테스크 큐에 넣어두고 이벤트 끝나면 실행하기
        renderBlocks("retry");
        if (moveType === "top") {
          seizeBlock();
        }
      }, 0);
      return true; // 빈값이 있으면 true 반환
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

// 블럭이 안착되었을 때
function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    // 더이상 움직일 수 없게 함
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}

function checkMatch() {
  const childNodes = playground.childNodes; // 모든 childNodes를 가져옴
  childNodes.forEach((child) => {
    let matched = true; // 줄이 완성되었다면
    child.children[0].childNodes.forEach((li) => {
      // 각각의 li 체크
      if (!li.classList.contains("seized")) {
        // 줄이 완성되지 않았다면
        matched = false;
      }
    });
    if (matched) {
      child.remove();
      prependNewLine(); // 위에 한 줄을 새로 추가
      console.log(score);
      score += 10;
      console.log(score);
      scoredisplay.innerText = score;
      switch (
        score // 일정 점수 이상일 때 속도 빨라짐
      ) {
        case 30:
          duration -= 100;
          break;
        case 50:
          duration -= 100;
          break;
        case 70:
          duration -= 50;
          break;
        case 100:
          duration -= 50;
          break;
      }
    }
  });
  generateNewBlock();
}

// 새로운 블럭 생성
function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);

  const blockArray = Object.entries(BLOCKS);
  const randomIndex = Math.floor(Math.random() * blockArray.length); // 랜덤한 인덱스 만들기
  movingItem.type = blockArray[randomIndex][0]; // type 이름 가져오기
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

// target이 유효한지 체크
function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  } else {
    return true;
  }
}

// 게임오버 출력
function showGameoverText() {
  gameText.style.display = "flex";
  setNicknameButton.style.display = "block";
}

// 방향키 입력시 이동
function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

// 방향 바꾸기
function changeDirection() {
  const direction = tempMovingItem.direction;
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);
  renderBlocks();
}

// 스페이스바 입력 시 빠르게 내리기
function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

// event handling
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39: // 오른쪽
      moveBlock("left", 1);
      break;
    case 37: //왼쪽
      moveBlock("left", -1);
      break;
    case 40: // 아래
      moveBlock("top", 1);
      break;
    case 38: // 위쪽
      changeDirection();
      break;
    case 32: // 스페이스 바
      dropBlock();
      break;
    default:
      break;
  }
});

restartbutton.addEventListener("click", () => {
  playground.innerHTML = "";
  gameText.style.display = "none";
  init();
});

setNicknameButton.addEventListener("click", () => {
  setNicknameButton.style.display = "none";
  document.querySelector(".setRanking").style.display = "block";
  document.querySelector(
    "body > div > div.game-text > form > input[type=text]:nth-child(2)"
  ).value = score;
});
