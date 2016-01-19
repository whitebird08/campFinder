
app.controller('HomeController', function($scope, $http, $location, userFactory, $sce, $route){

  $scope.$watch(function(){
     return $location.path();
  }, function(value){ 
      if (value == '/dash'){
        $http.get('/currentUser').then(function(res){
 
          $scope.dataStuff = res.data
          console.log(res.data, 'resdata from scope dot watch');
        })
      }

  })

  $scope.trustSrc = function(src) {
    return $sce.trustAsHtml(src);
  }

  var currUser;
  $scope.registerUser = function(e, pass){
  	$http.post('/campers/register', {email: e,password: pass}).then(function(res){
  		if(res.data == '*Camper already exists'){
  		$scope.registerError = res.data;  		
  		} else {
  			$scope.loginUser(res.data.email, pass);
  		}
  	})
  }

  var user = userFactory.getUser();

  $scope.loginUser = function(e, pass){
  	console.log("called login", e, pass);
  	$http.post('/campers/login', {email: e,password: pass}).then(function(res){
  		if(res.data == '*Invalid Email/Password'){

  		$scope.loginError = res.data; 
  		console.log($scope.loginError);		
  		} else {
		    userFactory.addUser(res.data.currentUser);
  			$location.path("/dash");
  		}
  	})
  }

  $scope.logoutUser = function(){
  	$http.get('/campers/logout').then(function(res){
  		console.log('logged out',res);
      userFactory.clearUser();
  		$location.path("/")
  	})
  }

  //Not working yet , could potentially store the facilityId in a DOM element
  //giving it an id and styling it as display hidden
  //then in the angular controller , traverse the DOM (somehow)
  //and retrieve the id of the facility through the hidden DOM element
  $scope.addToFavorites = function(id){
    console.log('add to favorites id', id);
  }


  $scope.addPlanToUser = function(plan){
    $http.post('/user/plans', {plan: plan, user: userFactory.getUser()}).then(function(response){
      console.log(response);
    })
  }

    $scope.expandCard = false;
    $scope.growCard = function(){
      $scope.expandCard = true;
    }

})

