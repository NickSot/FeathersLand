var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');

var db = require('../config/database');

router.get('/', function(req, res, next) {
    let user = req.session.user;

    if (req.session.authenticated){
        db.query('Select * From Books Where AuthorId = ?', [user.ID], (err, result) => {
            res.locals.authenticated = req.session.authenticated;
            console.log("User: " + req.session.user);
            if (result.length != 0){
                res.render('profile', {'user': user, books: result});
            }
            else{
                res.render('profile', {'user': user, books: []});
            }
        })
    }
    else{
        req.flash('error', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);

        req.session.authenticated = false;
        res.locals.authenticated = req.session.authenticated;
        res.render('index', {'user': user});
    }
});

router.post('/', [
    check("userBio").exists()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        res.setHeader("Content-type", "text/html; charset=utf8");
        return res.redirect(400, "back");
    }

    if (req.session.authenticated){
        userBio = req.body.userBio;

        let user = req.session.user;

        db.query('Update Users Set Bio = ? Where ID = ?', [userBio, user.ID], (err, result) => {
            if (err){
                res.redirect(500, "back");
            }
        });
        
        res.locals.authenticated = req.session.authenticated;
        res.redirect(200, '/profile');
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);
        res.locals.authenticated = req.session.authenticated;
        res.redirect(401, '/');
    }
});

module.exports = router;
