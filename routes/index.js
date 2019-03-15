var express = require('express');
var router = express.Router();
var db = require('../config/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Writer\'s den' });
});

router.post('/', (req, res) => {
  let rusername = req.body.runame;

  let rpwd = req.body.rpsw;

  let lusername = req.body.luname;

  let lpwd = req.body.lpsw;

  if (rusername == undefined && rpwd == undefined){
    //Login part
  }
  else{
    //Register part
  }

  db.query('Select * From Books', (err, result) => {
    console.log(result);
  })
});

module.exports = router;
