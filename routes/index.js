require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var campgrounds = db.get('campgrounds');
var sites = db.get('sites');
var campers = db.get('campers');
var unirest = require('unirest');
var parseString = require('xml2js').parseString;
var bcrypt = require('bcrypt');

router.post('/campers/addTrip', function(req,res,next){
  campers.findOne({_id: req.session.id}, function(err, doc){
    doc.trips.push(req.body);
    campers.update({_id: req.session.id}, doc, function(err, doc){
      res.json({error:err, doc:doc});
    })
  })     
  
})

router.post('/campers/register', function(req,res,next){
console.log('request',req.body);
var hash = bcrypt.hashSync(req.body.password, 8)
	campers.findOne({email:req.body.email}).then(function(camper){
	  if (camper){
	    res.json('*Camper already exists');
	  } else {
	    campers.insert({email:req.body.email, password:hash, trips:[]}).then(function(camper){
	      res.json(camper);
	    })
	  }
	})
})

router.post('/campers/login', function(req, res,next){
  campers.findOne({email:req.body.email}).then(function(camper){
    if (camper) {  
      if (bcrypt.compareSync(req.body.password, camper.password)){
        req.session.id = camper._id;
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

router.get('/currentUser', function(req,res,next){
  campers.findOne({_id: req.session.id}, function(err, doc){
    res.json({user: doc, string: 'HI!!!'});
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
            var available = r['$'].availabilityStatus

            var photo = r['$'].faciltyPhoto
            var amps = r['$'].sitesWithAmps
            var pets = r['$'].sitesWithPetsAllowed
            var sewerHookups = r['$'].sitesWithSewerHookup
            var waterHookups = r['$'].sitesWithWaterHookup
            var waterFront = r['$'].sitesWithWaterfront

            data.push( { 
              lat: lat, 
              lng: lng, 
              facilityId: parkID,
              facilityName: facilityName, 
              photo: photo,
              available: available,
              amps: amps,
              pets:pets,
              sewerHookups: sewerHookups,
              waterHookups: waterHookups,
              waterFront: waterFront
              } )
          });
      });

      unirest.get( "http://api.amp.active.com/camping/campsites?contractCode=CO&parkId=" + parkID + "&eqplen=50&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
      // unirest.get( "http://api.amp.active.com/camping/campgrounds?pstate=CO&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
      // unirest.get( "http://api.amp.active.com/camping/campgrounds?pname=ASPEN&api_key=6x8gz7qm68nwaj9ckzg3z5yg")
      .end(function (response) {
        var campsitesXML = response.body
        var data = []
        parseString(campsitesXML, function (err, result) {        
              // data.push( { campgroundName = parkId } )
        });
      // res.json(data);
    }); 
      res.json(data);
    }); 
});

router.get('/showTrips', function(req, res, next){
      var currentUser = req.session.camper;
      console.log('currentUser', currentUser);
      campers.findOne({_id:currentUser._id}, function(err, doc){
      res.json(doc);
    })
});

//* IMPORTANT * Keep this at the bottom * IMPORTANT *
router.get('*', function(req, res, next) {
  res.sendFile('index.html', {
    root: __dirname + '/../public/'
  });
});

module.exports = router;
