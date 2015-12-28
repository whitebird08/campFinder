// function initMap() {
//   var directionsDisplay = new google.maps.DirectionsRenderer;
//   var directionsService = new google.maps.DirectionsService;
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 7,
//     center: {lat: 41.85, lng: -87.65}
//   });
//   directionsDisplay.setMap(map);
//   directionsDisplay.setPanel(document.getElementById('right-panel'));

//   var control = document.getElementById('floating-panel');
//   control.style.display = 'block';
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

//   var onChangeHandler = function() {
//     calculateAndDisplayRoute(directionsService, directionsDisplay);
//   };
//   document.getElementById('start').addEventListener('change', onChangeHandler);
//   document.getElementById('end').addEventListener('change', onChangeHandler);
// }

// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
//   var start = document.getElementById('start').value;
//   var end = document.getElementById('end').value;
//   directionsService.route({
//     origin: start,
//     destination: end,
//     travelMode: google.maps.TravelMode.DRIVING
//   }, function(response, status) {
//     if (status === google.maps.DirectionsStatus.OK) {
//       directionsDisplay.setDirections(response);
//     } else {
//       window.alert('Directions request failed due to ' + status);
//     }
//   });
// }

// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBG9Tk95ahKFH2OvQLRf7fqrO37Y6_bZ24&signed_in=true&callback=initMap"
//         async defer></script>

