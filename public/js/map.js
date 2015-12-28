var directionService = new google.maps.DirectionsService();;
var directionsRenderer = new google.maps.DirectionsRenderer({ map: map }); ;
var map = null;
var routeBoxer = new RouteBoxer();

$(document).ready(function() {
 // function initialize() {
  
 //    console.log(map)
 //    // Default the map view to the continental U.S.
 //    var mapOptions = {
 //      center: new google.maps.LatLng(39.5403, -106.0600),
 //      mapTypeId: google.maps.MapTypeId.ROADMAP,
 //      zoom: 8
 //    };
    
 //    // map = new google.maps.Map(document.getElementById("map"), mapOptions);
 //    routeBoxer = new RouteBoxer();
    
 //    directionService = new google.maps.DirectionsService();
 //    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });      
 //  }

 


  var myLatlng = new google.maps.LatLng(39.5403, -106.0600);
  // var map = new google.maps.Map(document.getElementById("map"), {zoom: 8, center: myLatlng});
  map = new google.maps.Map(document.getElementById("map"), {zoom: 8, center: myLatlng});

  console.log(map)
  
  $.ajax({
    method: 'GET',
    url: '../parse',            
    success: function(data) {
      console.log('ajax');
   
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      }); 
      var dumpArray = [data]

      for(var i=0; i < data.length; i++){
        var iconBase = 'http://www.googlemapsmarkers.com/v1/009900/';
        var marker = new google.maps.Marker({
            position: data[i],
            icon: iconBase ,
            title: data[i].facilityName        
        });

        var contentString = '<div id="content">'+
          '<h1>' + data[i].facilityName + '</h1>' +
          "<div class='photo'><img src='http://www.reserveamerica.com" + data[i].photo + "'/></div>" +
          // '<div>' + data[i].available + '</div>' +
          // '<div>' + data[i].amps + '</div>' +
          // '<div>' + data[i].pets + '</div>' +
          // '<div>' + data[i].sewerHookups + '</div>' +
          // '<div>' + data[i].waterHookups + '</div>' +
          // '<div>' + data[i].waterFront + '</div>' +
          "<button id='journey'>Add to Journey</button>" +
          "<button id='sitesSpecs'>Show Specs</button>" + 
          '</div>'
          ;

        // console.log(data[i], 'dataaaaa')
        // console.log(data, 'dataaaaa')
        // console.log(data[i].lat, 'is data sub i sub zero dot lat')

        marker.setMap(map);
         // console.log(marker, 'markerrrrr')
        google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 
          return function(){
            infowindow.setContent(contentString);
            infowindow.open(map,marker);
          };
        })(marker,contentString,infowindow));
      }
      }
  });
});

      // var map = null;
      var boxpolys = null;
      var directions = null;
      // var routeBoxer = null;
      var distance = null; // km
      // var directionService;
      // var route;

   
      
      function route() {
        // Clear any previous route boxes from the map
        clearBoxes();
        
        // Convert the distance to box around the route from miles to km
        distance = parseFloat(document.getElementById("distance").value) * 1.609344;
        
        var request = {
          origin: document.getElementById("from").value,
          destination: document.getElementById("to").value,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        }
        
        // Make the directions request
        directionService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            
            // Box around the overview path of the first route
            var path = result.routes[0].overview_path;
            var boxes = routeBoxer.box(path, distance);
            drawBoxes(boxes);
          } else {
            alert("Directions query failed: " + status);
          }
        });
      }

      // Draw the array of boxes as polylines on the map
      function drawBoxes(boxes) {
        boxpolys = new Array(boxes.length);
        for (var i = 0; i < boxes.length; i++) {
          boxpolys[i] = new google.maps.Rectangle({
            bounds: boxes[i],
            fillOpacity: 0,
            strokeOpacity: 1.0,
            strokeColor: '#000000',
            strokeWeight: 1,
            map: map
          });
        }
        // console.log(boxes[0].N.N, 'is boxes dot n dot n')
        // console.log(boxes[0].N.j, 'is boxes dot n dot j')
        // console.log(boxes[0].j.N, 'is boxes dot j dot n')
        // console.log(boxes[0].j.j, 'is boxes dot j dot j')
        // if (data[i].lat > boxes[0].N.N && data[i].lat < boxes[0].N.j){
        //   marker.setMap(map);
        // }
        // if (data[i].lng > boxes[0].j.N && data[i].lng < boxes[0].j.j){
        //   marker.setMap(map);
        // }

      }

 
  // Clear boxes currently on the map
  function clearBoxes() {
    console.log('.....clearBoxes')
    console.log(map, 'map in clearBoxes');
    if (boxpolys != null) {
      for (var i = 0; i < boxpolys.length; i++) {
        boxpolys[i].setMap(null);
      }
    }
    boxpolys = null;
  }

  






