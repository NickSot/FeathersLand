var express = require('express');
var router = express.Router();
var pandoc = require('node-pandoc');
var db = require('../config/database');

router.get('/mybook', (req, res) => {
    let bookId = req.query.bookId;
    let query = `SELECT *
    FROM Chapters AS ch 
    WHERE ch.BookId = ?`;
    let bookQuery = `SELECT * FROM Books WHERE Id = ?`
    let commentsQuery = `Select * From BookComments bc Inner Join Users On bc.PosterId = Users.ID Where BookId = ? ORDER BY PostedOn ASC`;
    res.locals.authenticated = req.session.authenticated;

    if (!req.session.authenticated){
        req.flash('error', 'Няма такъв url!');
        res.setHeader("Content-type", "text/html; charset=utf8");
        res.redirect(401, '/');
        return;
    }

    db.query(bookQuery, [bookId], (err, book) => {
        if (book.length == 0){
            req.flash('error', 'Няма такъв url!');
            res.setHeader("Content-type", "text/html; charset=utf8");
            res.redirect(404, '/');
            return;
        }

        if (book[0].AuthorId != req.session.user.ID){
            req.flash('Няма такъв url!', 'error');
            res.setHeader("Content-type", "text/html; charset=utf8");
            res.redirect(403, '/');
            return;
        }

        if(err) throw err;
        db.query(query, [bookId], (err, chapters) => {
            // var show = false;

            // if (req.session.authenticated && req.session.user.ID == book.AuthorId){
            //     show = true;
            // }

            if(err) throw err;

            if (chapters == null){
                chapters = []
            }


            if(chapters.length > 0){
                db.query(commentsQuery,[bookId], (err, commentsForBook) => {
                    if(err) throw err;

                    res.render('book', {chapters : chapters, comments : commentsForBook, book : book[0], show: true, write: true, userId : req.session.user.ID});
            
                });
            }else{
                db.query(commentsQuery,[bookId], (err, commentsForBook) => {
                    if(err) throw err;

                    res.render('book', {chapters: commentsForBook, comments: [], book : book[0], show: true, write: true, userId : req.session.user.ID});
            
                });
            }
        });
    });
});

router.get('/', (req, res) => {
    let session = req.session;
    if(!session.authenticated){
        req.flash('error', 'Трябва да си в акаунта си за да можеш да твориш');
        res.setHeader("Content-type", "text/html; charset=utf8");
        res.redirect(401, "/");
    }
    else{
        res.locals.authenticated = session.authenticated;
        
        let query = "Select * from Books where AuthorId = ?";
        
        db.query(query, [session.user.ID], (err, userBooks) => {
            if(err) throw err;
            res.render('chooseBook', {books : userBooks });
        });
    }
});

var chapterId;
var chapter;

router.get('/:chapterId', (req, res) => {
    if (!req.session.authenticated){
        req.flash('error', 'Неправилен url!');
        res.setHeader("Content-type", "text/html; charset=utf8");
        res.redirect(401, '/');
    }
    else{
        let userId = req.session.user.ID;
        chapterId = req.params.chapterId;
        let query = `SELECT *
        FROM Chapters
        INNER JOIN Books ON Chapters.BookId = Books.Id 
        Inner Join Users On Books.AuthorId = Users.ID
        Where Chapters.Id = ?`;
        db.query(query, [chapterId], (err, result) => {
            if (result == undefined){
                req.flash('error', 'Неправилна операция!');
                res.setHeader("Content-type", "text/html; charset=utf8");
                res.redirect(404, '/');
                return;
            }

            if (result[0].ID != userId) {
                req.flash('error', 'Не притежаваш тази книга!');
                res.setHeader("Content-type", "text/html; charset=utf8");
                res.redirect(403, '/');
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

    pandoc(markdown, '-f markdown -t html5', (err, result) => {
        if (err) throw err;

        db.query('Update Chapters Set Content = ? Where Id = ?', [markdown, chapterId], (err) => {
            if (err){
                console.log(err);
                return res.redirect(500, "back");
            }

            res.setHeader("Content-type", "text/html; charset=utf8");
            res.status(200).json({'result': result, chapter: chapter});
        });
    });
});

module.exports = router;
