var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/', function(req, res, next) {
    let password = req.query.p;

    if (password == req.session.hashedPassword){
        db.query(`UPDATE Users Set Verified = 'Y'`, (err, result) => {
            req.flash('success', 'Успешно валидиране!');
            res.redirect('/');
        });
    }
    else{
        req.flash('error', 'Не!');
        res.redirect('/');
    }
});

module.exports = router;
