const mysql = require('mysql');
const fs    = require('fs');

var db = mysql.createConnection(JSON.parse(fs.readFile("./password.json")));

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql database");
});


module.exports = db;