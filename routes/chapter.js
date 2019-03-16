var express = require('express');
var router = express.Router();
var db = require('../config/database');

var chapterId;

router.get('/:id', (req, res) => {
    res.locals.authenticated = req.session.authenticated;

    chapterId = req.params.id;

    db.query('Select * From Chapters Where Id = ?', [chapterId], (err, chapters) => {
        let chapter = chapters[0];

        res.render('chapter', {layout: false, chapter: chapter});
    });
});

router.post('/:id', (req, res) => {
    console.log('Commented!');
    let text = req.body.comment;

    if (!req.session.authenticated){
        req.flash('info', 'Не можеш да пишеш коментари, ако не си се логнал/ла!');
        res.redirect('/chapter/' + chapterId);
    }
    else{
        db.query('Insert Into ChapterComments (Content, ChapterID, PosterId) Values (?, ?, ?)', [text, chapterId, req.session.user.ID], (err, result) => {
            if (err){
                throw err;
            }
            console.log('ASDASDS');
            res.redirect('/book/' + bookId);
        });
    }

});

module.exports = router;