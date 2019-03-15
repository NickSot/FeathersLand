var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/:id/show', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    db.query('Select * From Users Where ID = ?', [req.params.id], (err, result) => {
        res.render('author', {user: result[0]});
    });
});

module.exports = router;
