angular.module('AuthModule', [])

.controller('AuthController', function($http, $state) {
  let vm = this;
  vm.login = function(user, pass) { //MOVE TO FACTORY LATER
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
    vm.user = null;
    vm.pass = null;
  };

  vm.signup = function(user, pass) {
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
    vm.user = null;
    vm.pass = null;
  };
});