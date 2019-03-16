var express = require('express');
var router = express.Router();
var pandoc = require('node-pandoc');

router.get('/', (req, res) => {
    res.render('write', {layout: false, result: req.query.result});
});

router.post('/', (req, res) => {
    res.locals.authenticated = req.session.authenticated;

    let markdown = req.body.markdown;

    pandoc(markdown, '-f markdown -t html5', (err, result) => {
        if (err) throw err;

        res.json({'result': result});
    });
});

module.exports = router;
