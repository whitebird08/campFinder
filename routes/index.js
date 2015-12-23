var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/campFinder-db');
var campgrounds = db.get('campgrounds');
var sites = db.get('sites');
var campers = db.get('campers');
var unirest = require('unirest');
var parseString = require('xml2js').parseString;
var bcrypt = require('bcrypt');


router.post('/campers/register', function(req,res,next){
console.log('request',req.body);
var hash = bcrypt.hashSync(req.body.password, 8)
	campers.findOne({email:req.body.email}).then(function(camper){
	  if (camper){
	    res.json('*Camper already exists');
	  } else {
	    campers.insert({email:req.body.email, password:hash}).then(function(camper){
	      res.json(camper);
	    })
	  }
	})
})

router.post('/campers/login', function(req, res,next){
  campers.findOne({email:req.body.email}).then(function(camper){
    if (camper) {  
      if (bcrypt.compareSync(req.body.password, camper.password)){
        req.session.camper = camper;
        var temp = {};
        temp._id = camper._id;
        temp.email = camper.email;
        res.json({currentUser: temp, status: 200});
      } 
    } else {
      	console.log('in the else of login');
        res.json('*Invalid Email/Password');
      }
  })
})

router.get('/campers/logout', function(req,res,next){
	req.session.camper = null;
	res.json('Logged Out');
})


router.get('/parse', function(req, res, next) {
// unirest.get( "http://api.amp.active.com/camping/campsites?contractCode=CO&parkId=50032&eqplen=50&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
  unirest.get( "http://api.amp.active.com/camping/campgrounds?pstate=CO&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
  // unirest.get( "http://api.amp.active.com/camping/campgrounds?pname=ASPEN&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
    .end(function (response) {
      var campgroundsXML = response.body
      var data = []
      var parkID = 0;
      parseString(campgroundsXML, function (err, result) {

          result.resultset.result.map(function(r){
            var lng = Number(r['$'].longitude)
            var lat = Number(r['$'].latitude)
            parkID = Number(r['$'].facilityID)
            var facilityName = r['$'].facilityName
            
            // console.log(r['$'], 'rrrrrrrrrrrrrrrrr')
            data.push( { lat: lat, lng: lng, facilityName: facilityName, facilityId: parkID} )
          });
      });

      unirest.get( "http://api.amp.active.com/camping/campsites?contractCode=CO&parkId=" + parkID + "&eqplen=50&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
      // unirest.get( "http://api.amp.active.com/camping/campgrounds?pstate=CO&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
      // unirest.get( "http://api.amp.active.com/camping/campgrounds?pname=ASPEN&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
      .end(function (response) {
        var campsitesXML = response.body
        // console.log(response.body)
        var data = []
        parseString(campsitesXML, function (err, result) {        
              // console.log(result, "THIS IS IT!!!!!!!!!!!!!!!!!")
              // data.push( { campgroundName = parkId } )
        });
      // console.log(data) 
      // res.json(data);
    });
      // console.log(data) 
      res.json(data);
    });
  
});




//* IMPORTANT * Keep this at the bottom * IMPORTANT *
router.get('*', function(req, res, next) {
  res.sendFile('index.html', {
    root: __dirname + '/../public/'
  });
});

module.exports = router;
