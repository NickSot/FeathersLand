var express = require('express');
var router = express.Router();
var db = require('../config/database');


router.get('/', (req, res) => {
    if(!req.session.authenticated){
        req.flash('error', "Трябва да имаш акаунт, за да създаваш книги...");
        res.redirect('/');
    }
    res.locals.authenticated = req.session.authenticated;
    res.render('bookform');
});

router.post('/', (req, res) => {
    let name = req.body.name;
    let query = "INSERT INTO Books(AuthorId, Title, Posted) VALUES(?, ?, 'n')";
    db.query(query, [req.session.user.ID, name], (err, result) => {
        if(err) throw err;
        req.flash('success', 'Успешно създадена книга ' + name);
        res.redirect('/write/mybook?bookId='+result.insertId);
    });
})

module.exports = router;