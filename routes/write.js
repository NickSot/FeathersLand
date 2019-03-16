var express = require('express');
var router = express.Router();
var pandoc = require('node-pandoc');
var db = require('../config/database');

router.get('/mybook', (req, res) => {
    let bookId = req.query.bookId;
    let query = `SELECT ch.Title
    FROM Chapters AS ch 
    WHERE ch.BookId = ?`;
    let bookQuery = `SELECT * FROM Books WHERE Id = ?`
    let commentsQuery = "SELECT * FROM BookComments WHERE BookId = ?";
    res.locals.authenticated = req.session.authenticated;
    db.query(bookQuery, [bookId], (err, book) => {
        if(err) throw err;
        console.log(book.Title);
        db.query(query, [bookId], (err, chapters) => {
            if(err) throw err;
            if(chapters.length > 0){
                db.query(commentsQuery,[bookId], (err, commentsForBook) => {
                    if(err) throw err;
                    console.log("IT is from this one...");
                    console.log(chapters);
                    console.log(commentsForBook);
                    res.render('book', {chapters : chapters, comments : commentsForBook, book : book[0] , isMyBook : true });
            
                });
            }else{
                res.render('book', {chapters: null, comments:null, book : book[0], isMyBook : true})
            }
        });
    });
    // res.render('write', {layout: false, result: req.query.result});
});

router.get('/', (req, res) => {
    let session = req.session;
    if(!session.authenticated){
        req.flash('error', 'Трябва да си в акаунта си за да можеш да твориш');
        res.redirect("/");
    }
    else{
        res.locals.authenticated = session.authenticated;
        
        let query = "Select * from Books where AuthorId = ?";
        
        db.query(query, [session.user.ID], (err, userBooks) => {
            if(err) throw err;
            console.log(userBooks);
            res.render('chooseBook', {books : userBooks });
        });
    }
});

var chapterId;
var chapter;

router.get('/:chapterId', (req, res) => {
    chapterId = req.params.chapterId;

    db.query('Select * From Chapters Where Id = ?', [chapterId], (err, chapters) => {
        chapter = chapters[0];

        res.render('write', {layout: false, chapter: chapter, result: null});
    })
});

router.post('/', (req, res) => {
    res.locals.authenticated = req.session.authenticated;

    let markdown = req.body.markdown;

    console.log(markdown);

    pandoc(markdown, '-f markdown -t html5', (err, result) => {
        if (err) throw err;

        db.query('Update Chapters Set Content = ? Where Id = ?', [markdown, chapterId], (err) => {
            if (err){
                throw err;
            }

            res.json({'result': result, chapter: chapter});
        });
    });
});

module.exports = router;
