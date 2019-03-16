var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/', function(req, res, next) {
  db.query(`UPDATE Users Set Verified = 'Y'`, (err, result) => {
      if (req.query.verified){
          req.flash('info', 'Успешно валидиране!');
          res.redirect('/');
      }
      else{
          res.render('verify');
      }
  });
});

module.exports = router;
