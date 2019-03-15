var express = require('express');
var router = express.Router();
var db = require("../config/database");

const booksOnPage = 30;

router.get('/', function(req, res, next) {
    let offset = (req.query.page - 1) * 10;
    let query = 'select * from Books order by Rating desc LIMIT ' + booksOnPage + ' OFFSET ' +  offset;

    db.query(query, (err, result) => {
        if(err) throw err;
        if(result.length > 0){

            res.locals.authenticated = req.session.authenticated;
            // console.log("In the end: " + Math.ceil(result.length / booksOnPage))
            res.render('books', {books : result, 'numPages' : Math.ceil(result.length / booksOnPage)});

        }else{
            req.flash('error', "Изглежда свършиха книгите...");
            res.redirect('/');
        }
    });

});

module.exports = router;
