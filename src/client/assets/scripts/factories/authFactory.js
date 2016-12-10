angular.module('Factories', [])

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

  factory.logout = function() {
    $http.get('/logout')
    .then($state.go('login'));
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
});