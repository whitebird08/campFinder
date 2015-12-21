var express = require('express');
var router = express.Router();


router.get('/campgrounds', function(req,res,next){
  db.get('collection', function(response, err){
  	res.json(response);
  })
});





//* IMPORTANT * Keep this at the bottom * IMPORTANT *
router.get('*', function(req, res, next) {
  res.sendFile('index.html', {
    root: __dirname + '/../public/'
  });
});

module.exports = router;
