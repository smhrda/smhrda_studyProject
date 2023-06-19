const users = [];

// 채팅룸 접속 시
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// 현재 접속중인 유저 정보 가져오기
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// 채팅룸 접속 종료 시
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  // findIndex() : 만족하는 값이 없다면 -1 반환

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
