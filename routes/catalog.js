var express = require('express');
var router = express.Router();
var db = require("../config/database");

const booksOnPage = 20 ;

router.get('/', function(req, res, next) {
    let offset = (req.query.page - 1) * booksOnPage;
    let selectQuery = 'select * from Books order by Rating desc LIMIT ' + booksOnPage + ' OFFSET ' +  offset;
    let countQuery = 'select count(*) from Books';
    let booksCount;
    db.query(countQuery, (err, result) => {
        if(err) throw err;
        booksCount = result[0]['count(*)'];
    });

    db.query(selectQuery, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            // console.log("result: " + result.length);
            res.locals.authenticated = req.session.authenticated;
            // console.log("In the end: " + Math.ceil(booksCount / booksOnPage))
            res.render('catalog', {books : result, numPages : Math.ceil(booksCount / booksOnPage)});
        }else{
            req.flash('error', "Изглежда свършиха книгите...");
            res.redirect('/');
        }
    });

});

router.post('/', (req, res) => {
    let searchInput = req.body.search;
    let query = "Select * from Books INNER JOIN Users as u on AuthorId = u.Id where Title Like ? OR u.username Like ?";

    db.query(query, [searchInput, searchInput], (err, result) => {
        if(err) throw err;

        if(result.length === 0){

        }

    });

});

module.exports = router;
