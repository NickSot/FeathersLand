var express = require('express');
var router = express.Router();

var db = require('../config/database');

router.get('/', function(req, res, next) {
    if (req.session.authenticated){
        let user = req.session.user;

        res.locals.authenticated = req.session.authenticated;
        res.render('profile', {'user': user});
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);

        req.session.authenticated = false;
        res.locals.authenticated = req.session.authenticated;
        res.render('index', {'user': res[0]});
    }
});

router.post('/', (req, res) => {
    if (req.session.authenticated){
        userBio = req.body.userBio;

        db.query('Update Users Set Bio = ? Where ID = ?', [userBio, req.session.userId], (err, result) => {
            if (err){
                throw err
            }
        });

        db.query('Select * From Users Where ID = ?', [req.session.userId], (err, result, fields) => {
            if (err){
                throw err;
            }
            
            res.locals.authenticated = req.session.authenticated;
            res.render('profile', {'user': result[0]});
        });
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);
        res.locals.authenticated = req.session.authenticated;
        res.render('index');
    }
});

module.exports = router;
