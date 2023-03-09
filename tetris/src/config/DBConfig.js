const mysql = require('mysql');

let conn = mysql.createConnection({
    host : "127.0.0.1",
    user:"root",
    password:"smhrd12",
    port:"3306",
    database:"Ranking"
});

module.exports = conn;