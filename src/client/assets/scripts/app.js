angular.module('demoApp', ['ui.router', 'userModule', 'authModule', 'searchModule'])

.config(function($stateProvider, $urlRouterProvider){

  let checkSession = function($state, $http){
    $http({
      method: 'GET',
      url: '/auth'
    }).then(function(res){
      if(res.data.length > 0){
        $state.go('login')
      }
    })
  }

  $urlRouterProvider.otherwise('/user')

  $stateProvider
    .state('user', {
      url: '/user',
      templateUrl: 'assets/views/user/user.html',
      controller: 'userController',
      resolve: {
        sessionActive: checkSession
      }
    })
    .state('login', {
      url:"/login",
      templateUrl: 'assets/views/login/login.html',
      controller: 'authController'
    })
    .state('signup', {
      url:"/signup",
      templateUrl: 'assets/views/signup/signup.html',
      controller: 'authController'
    })
    .state('search', {
      url:"/search",
      templateUrl: 'assets/views/search/search.html',
      controller: 'searchController'
    })
})