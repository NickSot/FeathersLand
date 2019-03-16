var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.locals.authenticated = req.session.authenticated;
    res.render('book');
});

module.exports = router;
