var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.authenticated){
        res.render('write');
    }
    else{
        res.flash('info', 'Трябва да си влязъл/ла в профила си, за да достъпиш тази опция!');
        res.render('index');
    }
});

module.exports = router;
