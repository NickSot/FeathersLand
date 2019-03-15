var express = require('express');
var router = express.Router();
var db = require('../config/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Writer\'s den' });
});

router.post('/', (req, res) => {
  console.log('HERE');

  let rusername = req.body.runame;

  let rpwd = req.body.rpsw;

  let lusername = req.body.luname;

  let lpwd = req.body.lpsw;

  let rreppsw = req.body.rreppsw;

  if (rusername == undefined && rpwd == undefined){
    //Login part
  }
  else{
    if (rreppsw != rpwd){
      res.render('index');
    }
    else{
      console.log('HERE');

      db.query('Select * From Users Where username = ?', [rusername], (err, result) => {
        if (err) throw err;

        console.log(result);

        if (result.length){
          res.render('index');
        }
        else{
          db.query('Insert Into Users (username, pass) Values (?, ?)', [rusername, rpwd], (err, result) => {
            if (err) throw err;
      
            console.log(result);

            res.render('index');
          });
        }
      });
    }
  }

  db.query('Select * From Books', (err, result) => {
    console.log(result);
  })
});

module.exports = router;
