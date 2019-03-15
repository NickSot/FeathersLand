var express = require('express');
var router = express.Router();

var db = require('../config/database');

router.get('/', function(req, res, next) {
    let id = req.session.userId;

    db.query('Select * From Users Where Id = ?', [id], (err, result, fields) => {
        if (err){
            throw err;
        }

        res.render('profile', {'user': fields});
    });
});

router.post('/', (req, res) => {
    userBio = req.body.userBio;

    db.query('Update Users Set Bio = ? Where ID = ?', [userBio, req.session.userId], (err, result) => {
        if (err){
            throw err
        }

        console.log(req.session.userId);
    });

    db.query('Select * From Users Where ID = ?', [req.session.userId], (err, result, fields) => {
        if (err){
            throw err;
        }

        res.render('profile', {'user': fields});
    });
});

module.exports = router;
