var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    db.query('Select * From Users', (err, result) => {
        res.render('authors', {users: result});
    });
});

module.exports = router;
