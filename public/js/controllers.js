

app.controller('HomeController', function($scope, $http, $location, userFactory){
  var currUser;
  //example of send request to your express route
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
			  console.log(userFactory.getUser());
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
  //Not working yet , you could potentially store the facilityId in a DOM element
  //giving it an id and styling it as display hidden
  //then in your angular controller , traverse the DOM (somehow)
  //and retrieve the id of the facility through the hidden DOM element
  $scope.addToFavorites = function(id){
    console.log('add to favorites id', id);
  }


  $scope.addPlanToUser = function(plan){
    //when you want to make a post to add a plan to a user , 
    //you need to make sure you add the plan to the currently logged in user
    //so when you send the plan to your server to be inserted by monk into mongoDB
    //you will do a users.find({email: req.body.user.email}, function(err, user){
    // user.insert(req.body.plan);
    //})
    $http.post('/user/plans', {plan: plan, user: userFactory.getUser()}).then(function(response){
      console.log(response);
    })
  }

  






})
