var express = require('express');
var router = express.Router();
var db = require('../config/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Writer\'s den', messages: req.flash() });

  req.flash('info', 'Welcome');
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
        res.redirect('/'); 
      }else{
        req.flash('info', `Welcome ${lusername}!`);
        req.session.authenticated = true;
      }
    });
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
          db.query('Insert Into Users (username, pass, email) Values (?, ?, ?)', [rusername, rpwd, remail], (err, result) => {
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
