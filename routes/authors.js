var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    if (req.session.user != null && req.session.user != undefined){
        db.query('Select * From Users Where ID <> ?', [req.session.user.ID], (err, result) => {
            res.render('authors', {users: result});
        });
    }
    else{
        db.query('Select * From Users Where ID', (err, result) => {
            res.render('authors', {users: result});
        });
    }
});

module.exports = router;
