var express = require('express');
var router = express.Router();
var db = require('../config/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Writer\'s den' });
});

router.post('/', (req, res) => {
  db.query('Select * From Books', (err, result) => {
    console.log(result);
  })
});

module.exports = router;
