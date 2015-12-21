app.controller('HomeController', function($scope, $http){
	$scope.message = "home";
$http.get('/campground').then(function(res){
	$scope.campground = res;
})

})