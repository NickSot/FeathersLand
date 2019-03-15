var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/:id/show', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    db.query('Select * From Users Where ID = ?', [req.params.id], (err, result) => {
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
        
        db.query('Select * From Followers Where FollowingId = ?', [user.ID], (err, result) => {
            if (result.length != 0){
                req.flash('info', 'Вече си абониран за този автор!');
                res.redirect('/author/' + user.ID + '/show');
            }
            else{
                req.flash('info', 'Успешно абониране за автора!');
                db.query('Insert Into Followers (FollowerId, FollowingId) Values (?, ?)', [req.session.user.ID, user.ID], (err, result) => {
                    req.flash('info', 'Успешно абониране!');
                    res.redirect('/authors');
                });
            }
        });
    }
});

module.exports = router;
