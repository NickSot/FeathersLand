var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/:id', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;
    let id = req.params["id"];
    db.query('Select * From Books Where Id = ?', id, (err, book) => {
        if(err) throw err;
        console.log(book[0]);

        db.query('Select * From Chapters Where BookId = ?', id, (err, chapters) => {
            if(err) throw err;
            if(chapters.length === 0){
                req.flash('info', 'Nothing to show...');
                res.redirect('/catalog');
            }
            res.locals.authenticated = req.session.authenticated;
            res.locals.chapters = chapters;
            console.log(chapters.length);
            res.render('book', { chapters : chapters, book :  book[0]});
        } );
    });
});

module.exports = router;