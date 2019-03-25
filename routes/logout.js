var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.authenticated = false;
    res.locals.authenticated = req.session.authenticated;
    req.session.user = null;
    req.flash('success', 'Успешно отписване!');

    res.redirect('/');
});

module.exports = router;