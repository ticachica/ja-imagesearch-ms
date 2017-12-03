var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

var SearchLog = require('./SearchLog');

router.get('/', function (req, res) {
  //get the last 10 searches
  SearchLog.find({}).sort('-date').limit(10).exec(function(err, docs) { 
    //go through each doc and output JSON
    const searchHistory = [];
    docs.forEach(function(doc){
      searchHistory.push({
         term: doc.term,
         when: doc.when.toISOString()
      })
    });
    
    res.json(searchHistory);
    
  });
});

module.exports = router;