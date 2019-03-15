var express = require('express');
var router = express.Router();

var db = require('../config/database');

router.get('/', function(req, res, next) {
    let user = req.session.user;

    if (req.session.authenticated){

        res.locals.authenticated = req.session.authenticated;
        res.render('profile', {'user': user});
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

        let user = req.session.user;

        db.query('Update Users Set Bio = ? Where ID = ?', [userBio, req.session.user.ID], (err, result) => {
            if (err){
                throw err
            }
        });
        
        res.locals.authenticated = req.session.authenticated;
        res.render('profile', {'user': user});
    }
    else{
        req.flash('info', `Трябва да си влязъл в акаунта си, за да достъпиш тази опция!`);
        res.locals.authenticated = req.session.authenticated;
        res.render('index');
    }
});

module.exports = router;
