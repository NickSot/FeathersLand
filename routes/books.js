var express = require('express');
var router = express.Router();
var db = require("../config/database");

const booksOnPage = 30;

router.get('/:page', function(req, res, next) {
    let offset = (req.params.page - 1) * 10;
    let query = 'select * from Books order by Rating desc LIMIT ' + booksOnPage + ' OFFSET ' +  offset;
    // console.log("Query is:" + query);
    db.query(query, (err, result) => {
        console.log("Offset is:", offset);
        if(err) throw err;
        if(result.length > 0){

            res.locals.authenticated = req.session.authenticated;
            res.render('books', {books : result});

        }else{
            req.flash('error', "Изглежда сме в непродуктивен период...");
            res.redirect('/');
        }
    });

});

module.exports = router;
