var express = require('express');
var router = express.Router();
var db = require('../config/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Writer\'s den', messages: req.flash() });
});

router.post('/', (req, res) => {
  let rusername = req.body.runame;
  let rpwd = req.body.rpsw;
  let remail = req.body.remail;
  let rreppsw = req.body.rreppsw;
  let lusername = req.body.luname;
  let lpwd = req.body.lpsw;

  if (rusername == undefined && rpwd == undefined){
    let query = `Select * from Users WHERE username = ? AND pass = ?`;
    db.query(query, [lusername, lpwd], (err, result) => {
      if(err) throw err;
      if(result.length == 0){
        req.flash('info', "No such user!");
        res.render('index'); 
      }else{
        req.flash('info', `Welcome ${lusername}!`);
        req.session.authenticated = true;
        res.render('index')
      }
    });
  }
  else{
    if (rreppsw != rpwd){
      res.render('index');
    }
    else{
      console.log('HERE');

      db.query('Select * From Users Where username = ? Or email = ?', [rusername, remail], (err, result) => {
        if (err) throw err;

        console.log(result);

        if (result.length != 0){
          req.flash('info', "There is already a user with that username or email!");
          res.render('index');
        }
        else{
          db.query('Insert Into Users (username, pass, email) Values (?, ?, ?)', [rusername, rpwd, remail], (err, result) => {
            if (err) throw err;
      
            console.log(result);
            req.flash('info', "Successfully logged in! Now login!");
            res.render('index');
          });
        }
      });
    }
  }
});

module.exports = router;
