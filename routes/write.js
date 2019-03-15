var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('write',{layout:false});
});

module.exports = router;
