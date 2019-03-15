var express = require('express');
var router = express.Router();

var db = require('../config/database');

router.get('/', function(req, res, next) {
    if (req.session.authenticated){
        let id = req.session.userId;

        db.query('Select * From Users Where Id = ?', [id], (err, result, fields) => {
            if (err){
                throw err;
            }

            res.render('profile', {'user': result[0], obj: req.session});
        });
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);

        res.render('index', {'user': res[0], auth: req.session.authenticated});
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

            res.render('profile', {'user': result[0]});
        });
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);

        res.render('index');
    }
});

module.exports = router;
