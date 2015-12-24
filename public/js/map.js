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
              title: data[i].facilityName        
          });
        
        for(prop in data[i]){
          if(prop === 'Y'){
            console.log(prop, 'proppppppp')
          }
        }
          

          var contentString = '<div id="content">'+
            '<h1>' + data[i].facilityName + '</h1>' +
            "<div class='photo'><img src='http://www.reserveamerica.com" + data[i].photo + "'/></div>" +
            '<div>' + data[i].available + '</div>' +
            '<div>' + data[i].amps + '</div>' +
            '<div>' + data[i].pets + '</div>' +
            '<div>' + data[i].sewerHookups + '</div>' +
            '<div>' + data[i].waterHookups + '</div>' +
            '<div>' + data[i].waterFront + '</div>' +
            '</div>'
            ;

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

