var express = require('express');
var router = express.Router();
var pandoc = require('node-pandoc');
var db = require('../config/database');

router.get('/mybook', (req, res) => {
    let bookId = req.query.bookId;
    let query = `SELECT ch.Title AS characterTitle, b.Title AS bookTitle
    FROM Chapters AS ch
    INNER JOIN Books AS b ON ch.BookId = b.Id 
    WHERE ch.BookId = ?`;

    let commentsQuery = "SELECT * FROM BookComments WHERE BookId = ?"
    
    db.query(query, [bookId], (err, result) => {
        if(err) throw err;
        db.query(commentsQuery,[bookId], (err, commentsForBook) => {
            if(err) throw err;
            console.log("IT is from this one...");
            console.log(result);
            console.log(commentsForBook);
            res.render('book', {chapters : result, comments : commentsForBook, book : result[0].bookTitle, isMyBook : true });
    
        });
    });
    res.render('write', {layout: false, result: req.query.result});
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
    if (!req.session.authenticated){
        req.flash('warning', 'Неправилен url!');
        res.redirect('/');
    }
    else{
        console.log("Id: " + req.session.user.ID);

        let userId = req.session.user.ID;
        chapterId = req.params.chapterId;
        let query = `SELECT Users
        FROM Chapters AS ch
        INNER JOIN Books AS b ON ch.BookId = b.Id 
        Inner Join Users As u On b.authorId = u.ID
        Where ch.Id = ?`;
        db.query(query, [chapterId], (err, result) => {
            if (result.ID == userId) {
                req.flash('warning', 'Неправилен url!');
                res.redirect('/');
            }
            else{
                db.query('Select * From Chapters Where Id = ?', [chapterId], (err, chapters) => {
                    chapter = chapters[0];
            
                    res.render('write', {layout: false, chapter: chapter, result: null});
                })
            }
        })
    }
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
