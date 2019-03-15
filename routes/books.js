var express = require('express');
var router = express.Router();
var db = require("../config/database");

const booksOnPage = 30;

router.get('/:page', function(req, res, next) {
  let indexesStart = req.params.page * booksOnPage; 
  let indexesEnd   = indexesStart + booksOnPage;
  let query = "Select * from Books order by Rating descending LIMIT " + booksOnPage ;
  
  db.query(query, [indexesStart, indexesEnd], (err, result) => {
    if(err) throw err;

    if(result > 0){
      res.render('projects', {books : result});
    }

  });

});

module.exports = router;
