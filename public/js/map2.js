var directionService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer(); 
var map = null;
var routeBoxer = new RouteBoxer();
var data = null;

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
   
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      }); 
     

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

        // marker.setMap(map);
      
        google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 
          console.log(marker)
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
      var route;
      var markersArray = []

   
      
      function route(data) {

        clearBoxes()
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
            for(var i=0; i < boxes.length; i++){
              
              for(var j = 0; j < data.length; j++){
                    
                if(data[j].lat > boxes[i].N.N && data[j].lat < boxes[i].N.j){
                  if(data[j].lng < boxes[i].j.N && data[j].lng > boxes[i].j.j){
                    console.log('...found one')
                    var marker = new google.maps.Marker({
                      position: data[j],
                      icon: 'http://www.googlemapsmarkers.com/v1/009900/',
                      title: data[j].facilityName        
                    });
                    marker.setMap(map); 
                    markersArray.push(marker);
                   
                  } 

                } 
              } 
            } 
              
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
       

      }

 
  // Clear boxes currently on the map
  function clearBoxes() {
    // console.log('.....clearBoxes')
    // console.log(map, 'map in clearBoxes');
    if (boxpolys != null) {
      for (var i = 0; i < boxpolys.length; i++) {
        boxpolys[i].setMap(null);
      }
    }
    boxpolys = null;
  }


  
  






