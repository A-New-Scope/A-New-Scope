angular.module('App', ['ui.router', 'Factories', 'Controllers'])

.config(function($stateProvider, $urlRouterProvider) {

  let checkSession = function ($state, $http) {
    $http.get('/auth')
    .then(function(res) {
      if (res.data.length > 0) {
        $state.go('login');
      }
    });
  };

  $urlRouterProvider.otherwise('/user');

  $stateProvider
    .state('user', {
      url: '/user',
      templateUrl: 'assets/views/user.html',
      controller: 'UserController',
      controllerAs: 'user',
      resolve: {
        sessionActive: checkSession
      }
    })
    .state('edit', {
      url: '/edit/:trackId',
      templateUrl: 'assets/views/edit.html',
      controller: 'EditController',
      controllerAs: 'edit',
      resolve: {
        sessionActive: checkSession
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'assets/views/login.html',
      controller: 'AuthController',
      controllerAs: 'auth'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'assets/views/signup.html',
      controller: 'AuthController',
      controllerAs: 'auth'
    })
    .state('search', {
      url: '/search',
      templateUrl: 'assets/views/search.html',
      controller: 'SearchController',
      controllerAs: 'search'
    })
    .state('profile', {
      url: '/profile/:profileId',
      templateUrl: 'assets/views/profile.html',
      controller: 'ProfileController',
      controllerAs: 'profile'
    });
});