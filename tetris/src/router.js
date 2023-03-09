const express = require("express");
const router = express.Router();
const path = require("path");

const conn = require("./config/DBConfig.js"); // DB 연결 정보

// 랭킹 등록 라우터
router.get("/setRanking", (req, res) => {
  let nickname = req.query.nickname;
  let score = req.query.score;

  let sql =
    "insert into tetris_ranking(ranking_nick, ranking_score) values(?,?)";

  conn.query(sql, [nickname, score], (err, row) => {
    if (!err) {
      console.log("등록 성공:" + row);
      res.redirect("./rankBoard");
    } else {
      console.log("등록 실패:" + err);
    }
  });
});

// 랭킹 확인 라우터
router.get("/rankBoard", (req, res) => {
  let sql =
    "select ranking_nick, ranking_score from tetris_ranking order by ranking_score desc";

  conn.query(sql, (err, row) => {
    if (err) {
      console.log("조회 실패");
    } else if (row.length > 0) {
      for (let i = 0; i < row.length; i++) {
        console.log(row[i].ranking_nick);
        console.log(row[i].ranking_score);
        console.log("---");
      }
      res.render("rankBoard.ejs", {
        data: row,
      });
    } else if (row.length == 0) {
      console.log("조회된 데이터가 없습니다.");
    }
  });
});

/* // bootstrap 라우터 추가
router.use(
  "/bootstrap",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))
); */

module.exports = router;
