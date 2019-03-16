var express = require('express');
var router = express.Router();
var db = require('../config/database');

var authorId;

router.get('/:id/show', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    authorId = req.params.id;

    db.query('Select * From Users Where ID = ?', [authorId], (err, result) => {
        if (err) throw err;

        if (result.length == 0){
            req.flash('info', 'Няма такъв автор! Моля, не се опитвайте да чупите механизма на сайта!');
            res.redirect('/authors');
        }
        else{
            db.query('Select Users.* From Users Inner Join Followers On Followers.FollowerId = Users.ID Where Followers.FollowingId = ?', [authorId], (err, followersResult) => {
                if (err) throw err;
                
                db.query('Select * From Books Where AuthorId = ?', [authorId], (err, books) => {
                    if (err) throw err;

                    if (result.length == 0){
                        if (books.length == 0){
                            res.render('author', {user: result[0], followers: [], books: []});
                        }
                        else{
                            res.render('author', {user: result[0], followers: [], books: books});
                        }
                    }
                    else{
                        if (books.length == 0){
                            res.render('author', {user: result[0], followers: [], books: []});
                        }
                        else{
                            res.render('author', {user: result[0], followers: followersResult, books : books});
                        }
                    }
                });
            });
        }
    });
});

router.post('/:id/show', (req, res) => {
    console.log('HERE');

    if (!req.session.authenticated){
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);
        req.session.authenticated = false;
        res.locals.authenticated = req.session.authenticated;
        res.render('index');
    }
    else{
        res.locals.authenticated = req.session.authenticated;

        let user = req.body.user;
        
        db.query('Select * From Followers Where FollowingId = ? And FollowerId = ?', [authorId, req.session.user.ID], (err, result) => {
            if (result.length != 0){
                req.flash('info', 'Вече си абониран за този автор!');
                res.redirect('/author/' + authorId + '/show');
            }
            else{
                req.flash('info', 'Успешно абониране за автора!');
                db.query('Insert Into Followers (FollowerId, FollowingId) Values (?, ?)', [req.session.user.ID, authorId], (err, result) => {
                    req.flash('info', 'Успешно абониране!');
                    db.query('Update Users Set followerCount = followerCount + 1 Where ID = ?', [authorId]);
                    res.redirect('/author/' + authorId + '/show');
                });
            }
        });
    }
});

module.exports = router;
