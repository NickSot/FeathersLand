var express = require('express');
var router = express.Router();
var db = require('../config/database');
var bcrypt = require('bcrypt');

var bcryptSaltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Writer\'s den', messages: req.flash(), auth: req.session.authenticated});
});

router.post('/', (req, res) => {
  let rusername = req.body.runame;
  let rpwd = req.body.rpsw;
  let remail = req.body.remail;
  let rreppsw = req.body.rreppsw;
  let lusername = req.body.luname;
  let lpwd = req.body.lpsw;

  if (rusername == undefined && rpwd == undefined){ /// LOGIN HANDLE

    let query = `Select * from Users WHERE username = ?`;
    db.query(query, [lusername], (err, result) => {
      if(err) throw err;
      if(result.length == 0){
        res.redirect('/'); 
      }else{
        bcrypt.compare(lpwd, result[0].pass, (err, isPasswordCorrect) => {
          if(isPasswordCorrect){
            req.flash('success', `Добре дошъл/ла отново, ${lusername}!`);
            req.session.authenticated = true;
            req.session.userId = result[0].ID;
            res.redirect('/profile');
          }else{
            req.flash('error', 'Няма такъв потребител!');
            res.redirect('/');
          }
        });
      }
    });
  }
  else if (lusername == undefined && lpwd == undefined){ // REGISTER HANDLE
    if (rreppsw != rpwd){
      res.redirect('/');
    }
    else{

      db.query('Select * From Users Where username = ? Or email = ?', [rusername, remail], (err, result) => {
        if (err) throw err;

        if (result.length != 0){
          req.flash('error', "Вече има съществуващ акаунт с този мейл или никнейм!");
          res.redirect('/');
        }
        else{
          console.log("Correct Register!");
          bcrypt.hash(rpwd, bcryptSaltRounds, (err, hash) => {
            if(err) throw err;
            db.query('Insert Into Users (username, pass, email) Values (?, ?, ?)', [rusername, hash, remail], (err, result) => {
              if (err) throw err;
              
              console.log(result);
              req.flash('success', "Успешна регистрация! Приятно писане!");
              res.redirect('/');
            });
          });
        }
      });
    }
  }
  else{ // LOGOUT HANDLE
    req.session.authenticated = false;
    req.session.userId = null;

    req.flash('info', 'Успешно отписване!');
    res.redirect('/');
  }
});

module.exports = router;
