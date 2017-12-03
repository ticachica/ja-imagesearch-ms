const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const rp = require('request-promise');

router.use(bodyParser.urlencoded({ extended: true }));

const SearchLog = require('./SearchLog');

router.get('/:searchterm', function (req, res) {
  
  var searchTerm = req.params.searchterm;
  
  //default offset to 1 if not specified
  //TODO: validate offset value. Must be between 1 and 10 inclusive
  var offset = req.query.offset ? req.query.offset : 1;
  if (offset > 10)
    offset = 10;
  
  //Query Google Search API
  //GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures
  rp ({
    uri: 'https://www.googleapis.com/customsearch/v1',
    qs : {
      key: process.env.CSE_API_KEY,
      cx: process.env.GOOGLE_CSE_CX,
      q: searchTerm,
      searchType: 'image',
      num: offset
    },
    json: true
  })
    .then((results) => {
        //console.log(results);
        
        var items = results['items'];
        // create an array of objects
        var obj = [];
        for (var i = 0; i < items.length; i++) {
            obj.push({
               "url" : items[i].link,
               "snippet": items[i].snippet,
               "thumbnail" : items[i].image.thumbnailLink,
               "context" : items[i].image.contextLink
            });
        }
    
        var SearchLog = require('./SearchLog');
        var timestamp = new Date();
        
        SearchLog.create({ term: searchTerm, when: timestamp }, function (err, doc) {
          if (err) return err;
          // saved!
        });

      res.json(obj);
  })
    .catch((err) => {
      console.log(err);
      res.render('error')
  });
});

module.exports = router;