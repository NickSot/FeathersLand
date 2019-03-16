var express = require('express');
var router = express.Router();

var db = require('../config/database');

router.get('/', function(req, res, next) {
    let user = req.session.user;

    if (req.session.authenticated){
        db.query('Select * From Books Where AuthorId = ?', [user.ID], (err, result) => {
            res.locals.authenticated = req.session.authenticated;
            if (result.length != 0){
                res.render('profile', {'user': user, books: result});
            }
            else{
                res.render('profile', {'user': user, books: []});
            }
        })
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);

        req.session.authenticated = false;
        res.locals.authenticated = req.session.authenticated;
        res.render('index', {'user': user});
    }
});

router.post('/', (req, res) => {
    if (req.session.authenticated){
        userBio = req.body.userBio;

        console.log(req.body);

        let user = req.session.user;

        db.query('Update Users Set Bio = ? Where ID = ?', [userBio, user.ID], (err, result) => {
            if (err){
                throw err
            }

            console.log(result);
        });
        
        res.locals.authenticated = req.session.authenticated;
        res.redirect('/profile');
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);
        res.locals.authenticated = req.session.authenticated;
        res.redirect('/');
    }
});

module.exports = router;
