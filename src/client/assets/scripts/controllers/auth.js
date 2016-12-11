angular.module('Controllers', ['Factories'])

/**
 * Used for login and signup views.
 */
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