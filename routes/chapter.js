var express = require('express');
var router = express.Router();
var db = require('../config/database');
var nodePandoc = require('node-pandoc');

var chapterId;

router.get('/:id', (req, res) => {
    res.locals.authenticated = req.session.authenticated;

    chapterId = req.params.id;

    db.query('Select * From Chapters Where Id = ?', [chapterId], (err, chapters) => {
        db.query(`Select * From ChapterComments Inner Join Users On ChapterComments.PosterId
        =Users.Id Where ChapterId = ?;
        `, [chapterId], (err, result) => {
            let chapter = chapters[0];

            nodePandoc(chapter.Content, '-f markdown -t html5', (err, htmlContent) => {
                res.render('chapter', {layout: false, chapter: chapter, commentUsers: result, htmlContent: htmlContent});
            });
        });
    });
});

router.post('/:id', (req, res) => {
    console.log('Commented!');
    let text = req.body.comment;

    if (!req.session.authenticated){
        req.flash('error', 'Не можеш да пишеш коментари, ако не си в акаунта си!');
        res.redirect('/chapter/' + chapterId);
    }
    else{
        db.query('Insert Into ChapterComments (Content, ChapterID, PosterId) Values (?, ?, ?)', [text, chapterId, req.session.user.ID], (err, result) => {
            if (err){
                throw err;
            }
            res.redirect('/chapter/' + chapterId);
        });
    }

});

module.exports = router;