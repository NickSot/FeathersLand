var express = require('express');
var router = express.Router();
var db = require("../config/database");

const booksOnPage = 8 ;

function pagesCount(booksCount){
    return Math.ceil(booksCount / booksOnPage);
}

router.get('/', function(req, res, next) {
    let offset = (req.query.page - 1) * booksOnPage;
    let selectQuery = 'select * from Books WHERE BookPosted = \'y\' order by Rating desc';
    let startIdx, endIdx;
    db.query(selectQuery, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            startIdx = (req.query.page-1)*booksOnPage;
            endIdx = req.query.page * booksOnPage;
            res.locals.authenticated = req.session.authenticated;
            res.render('catalog', {books : result, numPages : pagesCount(result.length), startIdx: startIdx, endIdx: endIdx});
        }else{
            req.flash('error', "Изглежда на тази страница няма книги...");
            res.redirect(200, '/');
        }
    });
});



router.post('/', (req, res) => {
    let searchInput = "%" + req.body.search + "%";
    let query = "Select * from Books INNER JOIN Users as u on AuthorId = u.Id where Title Like ?";

    startIdx = (req.query.page-1)*booksOnPage;
    endIdx = req.query.page * booksOnPage;
    db.query(query, [searchInput], (err, result) => {
        res.locals.authenticated = req.session.authenticated;
        if(err) throw err;
        res.render("catalog", {books: result, numPages: pagesCount(result.length), startIdx: startIdx, endIdx: endIdx});
    });

});

module.exports = router;
