angular.module('authModule', [])

.controller('authController', function($scope, $http, $state) {
  $scope.login = function(user, pass) { //MOVE TO FACTORY LATER
    $http({
      method: 'POST',
      url: '/login',
      data: {
        username: user,
        password: pass
      }
    }).then(function(res) {
      if (res) {
        $state.go('user');
      }
    });
    $scope.user = null;
    $scope.pass = null;
  };

  $scope.signup = function(user, pass) {
    $http({
      method: 'POST',
      url: '/signup',
      data: {
        username: user,
        password: pass
      }
    }).then(function(res) {
      if (res) {
        $state.go('login');
      }
    });
    $scope.user = null;
    $scope.pass = null;
  };
});