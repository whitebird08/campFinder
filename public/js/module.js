var app = angular.module('campFinderApp', ['ngRoute']);
app.factory('userFactory', function(){
  var currentUser;
    return {
        getUser: function(){
            return currentUser;
        },
        addUser: function(user){
           currentUser = user;
        },
         clearUser: function(){
           currentUser = null;
        }  
    }               
});