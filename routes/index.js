var express = require('express');
var router = express.Router();
var db = require('../config/database');
var bcrypt = require('bcrypt');
var transporter = require('../config/mailing');
const {check, validationResult} = require('express-validator/check');

var bcryptSaltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.authenticated = req.session.authenticated;
  res.render('index', { messages: req.flash()});
});

router.post('/', (req, res) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()){
  //   return res.status(422).json({errors: errors.array()});
  // }

  res.locals.authenticated = req.session.authenticated;
  let rusername = req.body.runame;
  let rpwd = req.body.rpsw;
  let remail = req.body.remail;
  let rreppsw = req.body.rreppsw;
  let lusername = req.body.luname;
  let lpwd = req.body.lpsw;
  
  if (!req.session.authenticated){
    // if (rusername != undefined && rpwd != undefined && rreppsw != undefined && )

    if (rusername == undefined && rpwd == undefined){ /// LOGIN HANDLE

      let query = `Select * from Users WHERE username = ?`;

      db.query(query, [lusername], (err, result) => {
        if(err) throw err;

        if(result.length == 0){
          req.flash('error', 'Грешен никнейм, мейл или парола!');    
          res.setHeader('Content-type', 'text/html; charset=utf-8;');      
          res.redirect(401, 'back'); 
        }else{
          bcrypt.compare(lpwd, result[0].pass, (err, isPasswordCorrect) => {
            if(isPasswordCorrect){
              if (req.body.remember){
                  let date = new Date();

                  date.setDate(date.getDay() + 5);

                  res.cookie("username", lusername, {maxAge: date.getMilliseconds()});
                  res.cookie("password", lpwd, {maxAge: date.getMilliseconds()});
              }
              req.flash('success', `Добре дошъл/ла отново, ${lusername}!`);
              req.session.authenticated = true;
              req.session.user = result[0];
              res.setHeader('Content-type', 'text/html; charset=utf-8;');
              res.redirect(200, 'back');
            }else{
              console.log("Fail my friend!");
              req.flash('error', 'Грешен никнейм, мейл или парола!');
              res.setHeader('Content-type', 'text/html; charset=utf-8;');
              res.redirect(401, 'back');
            }
          });
        }
      });
    }
    else if (lusername == undefined && lpwd == undefined){ // REGISTER HANDLE
      if (rreppsw != rpwd){
        req.flash('error', 'Паролите не съответстват!');
        res.redirect(400, 'back');
      }
      else{

        db.query('Select * From Users Where username = ? Or email = ?', [rusername, remail], (err, result) => {
          if (err) throw err;

          if (result.length != 0){
            req.flash('error', "Вече има съществуващ акаунт с този мейл или никнейм!");
            res.setHeader('Content-type', 'text/html; charset=utf-8;');
            res.redirect(401, 'back');
          }
          else{
            bcrypt.hash(rpwd, bcryptSaltRounds, (err, hash) => {
              req.session.hashedPassword = hash;

              if(err) throw err;
              db.query("Insert Into Users (username, pass, Email, Verified) Values (?, ?, ?, 'Y')", [rusername, hash, remail], (err, result) => {
                if (err) throw err;

                let mailOptions = {
                    from: '"Feather Company" <feathers.land.original@gmail.com>', // sender address
                    to: remail, // list of receivers
                    subject: 'Здравей! :D', // Subject line
                    text: 'Имаме линк за теб! localhost:3001/verify/?p=' + hash, // plain text body
                    html: `<b>Имаме линк за теб!</b><br><a href="http://localhost:3001/verify/?p=${hash}">Натисни тук за верификация!</a>` // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.setHeader('Content-type', 'text/html; charset=utf-8;');
                        res.status(400).send({success: false});
                    } else {
                        console.log('YAY');
                        req.flash('success', `Успешна регистрация! Изпратихме ти мейл за верификация на регистрацията! Приятно писане!`);
                        res.setHeader('Content-type', 'text/html; charset=utf-8;');
                        res.redirect(200, 'back');
                    }
                });
              });
            });
          }
        });
      }
    }
  }
});

module.exports = router;
