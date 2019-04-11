var express = require('express');
var router = express.Router();
var db = require('../config/database');

var authorsOnPage = 4;


router.get('/search', function(req, res, next){
    let search = "%" + req.query.search + "%";
    let query = "SELECT * FROM Users a WHERE a.username LIKE ?";
    res.locals.authenticated = req.session.authenticated;

    db.query(query, search, (err, result) => {
        if(err) throw err;
        res.render("authors", {users: result, numPages: 1});
    });
});

router.get('/:page', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;

    let offset = (req.params.page - 1) * authorsOnPage;
    let countQuery = 'select count(*) from Users';

    db.query(countQuery, (err, result) => {
        if(err) throw err;
        authorsCount = result[0]['count(*)'];
    });

    if (req.session.user != null && req.session.user != undefined){
        db.query('Select * From Users Where ID <> ? Order By overallRating Desc LIMIT ' + authorsOnPage + ' OFFSET ' +  offset, [req.session.user.ID], (err, result) => {
            res.render('authors', {users: result, numPages: Math.ceil(authorsCount/authorsOnPage)});
        });
    }
    else{
        db.query('Select * From Users Order By overallRating Desc LIMIT ' + authorsOnPage + ' OFFSET ' + offset, (err, result) => {
            res.render('authors', {users: result, numPages: Math.ceil(authorsCount/authorsOnPage)});
        });
    }
});


module.exports = router;
