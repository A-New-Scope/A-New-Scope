angular.module('demoApp', ['ui.router', 'demoModule', 'authModule'])

.config(function($stateProvider, $urlRouterProvider) {

  let checkSession = function ($state, $http) {
    $http({
      method: 'GET',
      url: '/auth'
    }).then(function(res) {
      if (res.data === 'unauthorized') {
        $state.go('login');
      }
    });
  }

  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('demo', {
      url: '/demo',
      templateUrl: 'assets/views/demo/demo.html',
      controller: 'demoController',
      resolve: {
        sessionActive: checkSession
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'assets/views/login/login.html',
      controller: 'authController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'assets/views/signup/signup.html',
      controller: 'authController'
    });
});