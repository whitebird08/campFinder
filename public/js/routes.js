app.config(function($routeProvider, $locationProvider){
 $routeProvider
 .when('/', {
   templateUrl: '/partials/home.html',
   controller: 'HomeController'
 })
 .when('/dash', {
   templateUrl: '/partials/dash.html',
   controller: 'HomeController'
 })
  .when('/campgrounds', {
   templateUrl: '/partials/campgrounds.html',
   controller: 'HomeController'
 })
   .otherwise({redirectTo:'/'});
   $locationProvider.html5Mode(true);
})

// app.run(function($rootScope, $location){
//   $rootScope.$on('$routeChangeError', function(event, next, previous, error){
//     if(error === "AUTH_REQUIRED"){
//       $location.path('/');
//     }
//   })
// })

// function resolveUser(userFactory){
//   if(userFactory.getUser){
//   return userFactory.getUser();
//   }else{
//   	$rootScope.$broadcast("$routeChangeError");
//   }

// }