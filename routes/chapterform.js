var express = require('express');
var router = express.Router();
var db = require('../config/database');


router.get('/:bookId', (req, res) => {
    if(!req.session.authenticated){
        req.flash('error', "Трябва да имаш акаунт, за да създаваш книги...");
        res.redirect('/');
    }

    res.locals.authenticated = req.session.authenticated;
    console.log("Book title is: " + req.query.bookTitle+ ", and id: " + req.params.bookId);
    res.render('chapterform', {bookTitle: req.query.bookTitle, bookId: req.params.bookId});
});

router.post('/:bookId', (req, res) => {
    console.log("Book Id is: " + req.params.bookId);
    let name = req.body.name;
    let query = "INSERT INTO Chapters(BookId, Title, Posted, Content) VALUES(?, ?, 'n', '#Започни своята история тук...')";
    db.query(query, [req.params.bookId, name], (err, result) => {
        if(err) throw err;
        req.flash('success', 'Успешно създадена глава ' + name);
        res.redirect('/chapter/'+result.insertId);
    });
})

module.exports = router;