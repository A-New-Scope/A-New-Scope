angular.module('demoApp', ['ui.router', 'demoModule', 'authModule'])

.config(function($stateProvider, $urlRouterProvider){

  function checkSession($state, $http){
    $http({
      method: 'GET',
      url: '/auth'
    }).then(function(res){
      if(res.data === "unauthorized"){
        $state.go('login')
      }
    })
  }

  $urlRouterProvider.otherwise('/demo')

  $stateProvider
    .state('demo', {
      url: '/demo',
      templateUrl: './demo.html',
      controller: 'demoController',
      resolve: {
        sessionActive: checkSession
      }
    })
    .state('login', {
      url:"/login",
      templateUrl: './login.html',
      controller: 'authController'
    })
    .state('signup', {
      url:"/signup",
      templateUrl: './signup.html',
      controller: 'authController'
    })
})