var express = require('express');
var router = express.Router();
var db = require('../config/database');

var authorId;

router.get('/:id/show', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    authorId = req.params.id;

    db.query('Select * From Users Where ID = ?', [authorId], (err, result) => {
        if (result.length == 0){
            req.flash('info', 'Няма такъв автор! Моля, не се опитвайте да чупите механизма на сайта!');
            res.redirect('/authors');
        }
        else{
            console.log(result);
            res.render('author', {user: result[0]});
        }
    });
});

router.post('/:id/show', (req, res) => {
    if (!req.session.authenticated){
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);
        req.session.authenticated = false;
        res.locals.authenticated = req.session.authenticated;
        res.render('index');
    }
    else{
        res.locals.authenticated = req.session.authenticated;

        let user = req.body.user;

        console.log("User: " + user);
        
        db.query('Select * From Followers Where FollowingId = ?', [authorId], (err, result) => {
            if (result.length != 0){
                req.flash('info', 'Вече си абониран за този автор!');
                res.redirect('/author/' + authorId + '/show');
            }
            else{
                req.flash('info', 'Успешно абониране за автора!');
                db.query('Insert Into Followers (FollowerId, FollowingId) Values (?, ?)', [req.session.user.ID, authorId], (err, result) => {
                    req.flash('info', 'Успешно абониране!');
                    res.redirect('/authors');
                });
            }
        });
    }
});

module.exports = router;
