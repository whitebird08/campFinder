var directionService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer(); 

var map = null;
var routeBoxer = new RouteBoxer();
var data = null;
var currentRequest = null;
var directionsArr = [];

$(document).ready(function() {

  var myLatlng = new google.maps.LatLng(39.5403, -106.0600);
  // var map = new google.maps.Map(document.getElementById("map"), {zoom: 8, center: myLatlng});
  map = new google.maps.Map(document.getElementById("map"), {zoom: 8, center: myLatlng});
  directionsRenderer.setMap(map)

  $.ajax({
    method: 'GET',
    url: '../parse',            
    success: function(data) {
      data = data;
      $('#get-route').on('click', function(){       
        route(data);
      });
    }
  });
});

// var map = null;
var boxpolys = null;
var directions = null;
// var routeBoxer = null;
var distance = null; // km
// var directionService;
var route;
var markersArray = [];
// console.log(markersArray)
var waypoints = [];
waypointNames = [];

function route(data, waypts) {

  clearBoxes();
  
  function setMapOnAll(map) {
    for (var i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(map);

    }
  }
  
  function clearMarkers() {
    setMapOnAll(null);
  }
  clearMarkers();
  
  // Convert the distance to box around the route from miles to km
  distance = parseFloat(document.getElementById("distance").value) * 1.609344;
  
  var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    waypoints: waypts,
    optimizeWaypoints:true
  }

  currentRequest = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    waypoints: waypts,
    optimizeWaypoints:true
  }

  // Make the directions request
  directionService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var tempArr = result.routes[0].legs[0].steps;
      for(var i = 0; i < tempArr.length; i++){
        directionsArr.push({
          distance: tempArr[i].distance.text,
          instructions: tempArr[i].instructions
        })
      }
      directionsRenderer.setDirections(result);
      directionsRenderer.setPanel(document.getElementById('right-panel'));
      
    
      // Box around the overview path of the first route
      var path = result.routes[0].overview_path;
      var boxes = routeBoxer.box(path, distance);
      drawBoxes(boxes);

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      }); 
      
      
      for(var i=0; i < boxes.length; i++){  
        for(var j = 0; j < data.length; j++){ 
              console.log(boxes, 'boxes')
          if(data[j].lat > boxes[i].R.R && data[j].lat < boxes[i].R.j){
            if(data[j].lng < boxes[i].j.R && data[j].lng > boxes[i].j.j){
              var marker = new google.maps.Marker({
                position: data[j],
                icon: 
                    {      
                        url: '/images/markerWholeSharp.svg',
                        scaledSize: new google.maps.Size(60, 70)
                        // anchor: new google.maps.Point(20, 58)
                    },

                 // icon: 'http://www.googlemapsmarkers.com/v1/009900/',
                title: data[j].facilityName        
              });
              marker.setMap(map); 
              markersArray.push(marker);
              

              var contentString = '<div>'+
                '<h1 class="infoWindow">' + data[j].facilityName + '</h1>' +

                "<div class='photo'><img src='http://www.reserveamerica.com" + data[j].photo + "'/></div>" +
                // '<div>' + data[j].available + '</div>' +
                // '<div>' + data[j].amps + '</div>' +
                // '<div>' + data[j].pets + '</div>' +
                // '<div>' + data[j].sewerHookups + '</div>' +
                // '<div>' + data[j].waterHookups + '</div>' +
                // '<div>' + data[j].waterFront + '</div>' +
                "<button id='journey' name='" + data[j].facilityName + "' value='" + data[j].lat + "," + data[j].lng + "'>ADD</button>"  +
                '</div>';

              google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 
                return function(){
                  infowindow.setContent(contentString);
                  infowindow.open(map,marker);
                };
              })(marker,contentString,infowindow)); 

            } 
          } 
        } 
      }
      for (var i = 0; i < markersArray.length; i++){
        // console.log(markersArray[i].title, 'markersArray')  
        // $('.markerLinks').append('<div>' + markersArray[i].title + '</div>' );
        $('.markerLinks').append('<a href="#">' + markersArray[i].title + '</a><br>' );
        // console.log(markersArray, 'markersArray')

      }  
      
    } else {
      alert("Directions query failed: " + status);
    }  
    
  });
}
   // //on click add marker to waypoints array and 
   $(document).on('click', '#journey', function(){
      // console.log($(this)[0].name, 'thissss')
    waypoints.push({ location:$(this)[0].value , stopover:true})
    waypointNames.push($(this)[0].name)
     // console.log(waypoints, 'waypointsArray')
     // console.log(waypointNames, 'waypointsNames')
    updateRoute(waypoints)

   })


function updateRoute(waypts){

  var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    waypoints: waypts
  }

  // Make the directions request
  directionService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
          directionsArr = [];
             if (result.routes[0].legs[0].steps) {
          var tempArr = result.routes[0].legs[0].steps;
          for(var i = 0; i < tempArr.length; i++){
            directionsArr.push({
              distance: tempArr[i].distance.text,
              instructions: tempArr[i].instructions
            })
          }
      };

         if (result.routes[0].legs[1].steps) {
          var tempArr1 = result.routes[0].legs[1].steps;
          for(var i = 0; i < tempArr1.length; i++){
            directionsArr.push({
              distance: tempArr1[i].distance.text,
              instructions: tempArr1[i].instructions
            })
            // console.log('updated Directions Arr', directionsArr);
          }
      };

      $('#createTripButton').on('click', function(){
        console.log('dirArr', directionsArr);
        if(directionsArr.length > 0){
          $.ajax({
            type: "POST",
            url: "../campers/addTrip",
            data: {tripName: $('#trip').val(), startDate: $('#startDate').val(), endDate: $('#endDate').val(), to: $('#to').val(), from: $('#from').val(), directions: directionsArr},
            cache: false,
            success: function(data){
             if(data)console.log(data)
            }
          });
        }
      })
      directionsRenderer.setDirections(result);
      directionsRenderer.setPanel(document.getElementById('right-panel'));
    } 
  })
}

// Draw the array of boxes as polylines on the map
function drawBoxes(boxes) {
  boxpolys = new Array(boxes.length);
  for (var i = 0; i < boxes.length; i++) {
    boxpolys[i] = new google.maps.Rectangle({
      bounds: boxes[i],
      fillOpacity: 0,
      strokeOpacity: 0.0,
      strokeColor: '#000000',
      strokeWeight: 1,
      map: map
    });
  }
}

// Clear boxes currently on the map
function clearBoxes() {
  if (boxpolys != null) {
    for (var i = 0; i < boxpolys.length; i++) {
      boxpolys[i].setMap(null);
    }
  }
  boxpolys = null;
}








