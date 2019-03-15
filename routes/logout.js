var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.authenticated = false;
    res.locals.authenticated = req.session.authenticated;
    req.session.user = null;
    console.log(req.session);
    req.flash('info', 'Успешно отписване!');

    res.render('index');
});

module.exports = router;