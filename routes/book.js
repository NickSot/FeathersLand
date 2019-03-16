var express = require('express');
var router = express.Router();
var db = require('../config/database');

var bookId;

router.get('/:id', function(req, res, next) {
    bookId = req.params.id;

    res.locals.authenticated = req.session.authenticated;
    //let id = req.params["id"];
    db.query('Select * From Books Where Id = ?', [bookId], (err, book) => {
        if(err) throw err;
        console.log(book[0]);
        bookId = book[0].Id;
        db.query('Select * From Chapters Where BookId = ?', [bookId], (err, chapters) => {
            db.query('Select * From BookComments Inner Join Users On PosterId = Users.ID Where BookId = ?', [bookId], (err, commentsUsers) => {
                if(err) throw err;

                if(chapters.length === 0){
                    req.flash('info', 'Все още няма глави!');
                    res.redirect('/catalog');
                }
                else{
                    res.locals.authenticated = req.session.authenticated;
                    res.locals.chapters = chapters;
                    console.log(chapters.length);
                    console.log(book[0]);

                    if (commentsUsers.length == 0){
                        commentsUsers = [];
                    }

                    res.render('book', { chapters : chapters, book :  book[0], comments: commentsUsers});  
                }
            });
        });
    });
});

router.post('/:id', (req, res) => {
    console.log('Commented!');
    let text = req.body.comment;

    if (!req.session.authenticated){
        req.flash('info', 'Не можеш да пишеш коментари, ако не си се логнал/ла!');
        res.redirect('/book/' + bookId);
    }
    else{
        db.query('Insert Into BookComments (Content, BookID, PosterId) Values (?, ?, ?)', [text, bookId, req.session.user.ID], (err, result) => {
            if (err){
                throw err;
            }
            console.log('ASDASDS');
            res.redirect('/book/' + bookId);
        });
    }
});

module.exports = router;