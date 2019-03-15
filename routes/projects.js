var express = require('express');
var router = express.Router();
var db = require("../config/database");

const booksOnPage = 30;

router.get('/:page', function(req, res, next) {
    let offset = req.params.page * 10;
    let query = "Select * from Books WHERE AuthorId = ? order by Rating desc LIMIT " + booksOnPage + " OFFSET " + offset;

    db.query(query, [req.session.user.ID], (err, result) => {
        if(err) throw err;

        if(result.length > 0){
            res.locals.authenticated = req.session.authenticated;
            res.render('projects', {books : result});
        }else{
            req.flash('error', "Все още нямаш книги!");
            res.redirect('/');
        }

    });

});

module.exports = router;
