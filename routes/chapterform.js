var express = require('express');
var router = express.Router();
var db = require('../config/database');


router.get('/:bookId', (req, res) => {
    if(!req.session.authenticated){
        req.flash('error', "Трябва да имаш акаунт, за да създаваш глави на книгите...");
        res.redirect('/');
    }
    res.locals.authenticated = req.session.authenticated;
    console.log("Book title is: " + req.query.bookTitle+ ", and id: " + req.params.bookId);
    res.render('chapterform', {bookTitle: req.query.bookTitle, bookId: req.params.bookId});
});

router.post('/:bookId', (req, res) => {
    let name = req.body.name;
    let bookTitle = req.query.bookTitle;

    db.query(`SELECT * FROM Chapters Where BookId = ? ORDER BY Id DESC LIMIT 1`, [req.params.bookId], (err, result) => {
        if(name.length == 0){
            req.flash('error', 'Не може да имаш безименни глави!');
            res.redirect('/newchapter/' + req.params.bookId + "?bookTitle=" + bookTitle);
        }else{
            let chapter = result[0];

            if (chapter != undefined){
                let query = "INSERT INTO Chapters(BookId, ChapterTitle, ChapterPosted, Content, PreviousChapter) VALUES(?, ?, 'N', '#Започни своята история тук...', ?)";
             
                db.query(query, [req.params.bookId, name, chapter.Id], (err, result) => {
                    if(err) throw err;
                    query = "Update Chapters Set NextChapter = ? Where Id = ?";
                    db.query(query, [result.insertId, chapter.Id], () => {
                        req.flash('success', 'Успешно създадена глава ' + name);
                        res.redirect('/chapter/'+result.insertId);
                    });
                });
            }
            else{
                let query = "INSERT INTO Chapters(BookId, ChapterTitle, ChapterPosted, Content) VALUES(?, ?, 'N', '#Започни своята история тук...')";
            
                db.query(query, [req.params.bookId, name], (err, result) => {
                    if(err) throw err;
                    req.flash('success', 'Успешно създадена глава ' + name);
                    res.redirect('/chapter/'+result.insertId);
                });
            }
        }
    });
})


module.exports = router;