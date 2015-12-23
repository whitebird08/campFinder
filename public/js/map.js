$(document).ready(function() {
        var myLatlng = new google.maps.LatLng(39.5403, -106.0600);
        var map = new google.maps.Map(document.getElementById("map"), {zoom: 8, center: myLatlng});
  
  $.ajax({
      method: 'GET',
      url: '../parse',            
      success: function(data) {
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        }); 

        for(var i=0; i < data.length; i++){
          var iconBase = 'http://www.googlemapsmarkers.com/v1/009900/';
          var marker = new google.maps.Marker({
              position: data[i],
              icon: iconBase ,
              title:"Hello Campground"          
          });

          var contentString = '<div id="content">'+
            '<h1>' + data[i].facilityName + '</h1>' +
            '</div>';

          console.log(data[i], 'dataaaaa')
          marker.setMap(map);
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

