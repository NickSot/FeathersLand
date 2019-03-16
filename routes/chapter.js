var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/:id', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    let chapterId = req.params.id;

    db.query('Select * From Chapters Where Id = ?', [chapterId], (err, chapters) => {
        let chapter = chapters[0];

        res.render('chapter', {layout: false, chapter: chapter});
    });
});

module.exports = router;