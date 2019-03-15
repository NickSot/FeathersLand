var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.authenticated = false;
    req.session.userId = null;
    console.log(req.session);
    req.flash('info', 'Успешно отписване!');

    res.render('index', {obj: req.session});
});

module.exports = router;