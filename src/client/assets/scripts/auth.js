angular.module('AuthModule', [])

.factory('AuthFactory', function ($http, $state) {
  let factory = {};

  factory.login = function(user, pass) {
    $http.post('/login', {
      username: user,
      password: pass
    })
    .then(function(res) {
      if (res) {
        $state.go('user');
      }
    });
  };

  factory.signup = function(user, pass) {
    $http.post('/signup', {
      username: user,
      password: pass
    })
    .then(function(res) {
      if (res) {
        $state.go('login');
      }
    });
  };

  return factory;
})

.controller('AuthController', function(AuthFactory) {
  let vm = this;

  vm.login = function (user, pass) {
    AuthFactory.login(user, pass);
    vm.user = null;
    vm.pass = null;
  };

  vm.signup = function (user, pass) {
    AuthFactory.signup(user, pass);
    vm.user = null;
    vm.pass = null;
  };
});