angular.module('authModule', [])
.controller('authController', function($scope, $http, $state){
  $scope.login = function(user, pass) { //MOVE TO FACTORY LATER
    $http({
      method: 'POST',
      url: '/login',
      data: {
        username: user,
        password: pass
      }
    });
    $state.go('demo');
  };

  $scope.signup = function(user, pass) {
    $http({
      method: 'POST',
      url: '/signup',
      data: {
        username: user,
        password: pass
      }
    });
    //go somewhere do something
  };
});