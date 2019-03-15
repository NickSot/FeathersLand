const mysql = require('mysql');
const fs    = require('fs');

var db = mysql.createConnection({
  "host": "localhost",
  "user": "root",
  "password": fs.readFileSync('./password.json').password,
  "database": "WritersDenDB"
}); 


db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql database");
});

module.exports = db;