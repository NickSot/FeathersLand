var express = require('express');
var router = express.Router();
var pandoc = require('node-pandoc');

function generateThroughMarkdown(content){
    var thing;
    pandoc(content, '-f markdown -t html5', (err, result) =>{
        if(err) throw err;
        console.log(result);    
        thing = result;
    });
    return thing;
}

router.get('/', (req, res) => {
    res.locals.authenticated = req.session.authenticated;

    res.render('write',{layout:false, markdown: generateThroughMarkdown});
});

router.post('/', (req, res) => {
    let content = req.body.content;
    console.log(content);
});

module.exports = router;
