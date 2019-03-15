const mysql = require('mysql');
const fs    = require('fs');

var db = mysql.createConnection({
  "host": "localhost",
  "user": "root",
  "password": fs.readFileSync('password.json').password,
  "database": "WritersDenDB"
});

module.exports = db;