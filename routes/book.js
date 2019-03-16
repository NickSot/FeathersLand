var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/:id', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;
    let id = req.params["id"];
    db.query('Select * From Chapters Where BookId = ?', id, (err, result) => {
        if(err) throw err;
        res.locals.authenticated = req.session.authenticated;
        console.log(result[0]);
        res.render('book', {book: result[0]})
    } );

    res.render('book');
});

module.exports = router;