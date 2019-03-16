var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/:id', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    db.query('Select * ');

    res.render('book');
});

module.exports = router;