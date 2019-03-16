var express = require('express');
var router = express.Router();
var pandoc = require('node-pandoc');

router.get('/', (req, res) => {
    res.locals.authenticated = req.session.authenticated;
    console.log("Markdown: " + req.query.markdown);

    pandoc(req.query.markdown, '-f markdown -t html5', (err, result) => {
        if (err) throw err;

        console.log('Result: ' + result);

        res.render('write',{layout:false, result: result.toString()});
    });
});

router.post('/', (req, res) => {
    let content = req.body.content;
    console.log(content);
});

module.exports = router;
