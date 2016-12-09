angular.module('App', ['ui.router', 'UserModule', 'AuthModule', 'SearchModule', 'ProfileModule', 'EditModule'])

.config(function($stateProvider, $urlRouterProvider) {

  let checkSession = function ($state, $http) {
    $http({
      method: 'GET',
      url: '/auth'
    }).then(function(res) {
      if (res.data.length > 0) {
        $state.go('login');
      }
    });
  };

  $urlRouterProvider.otherwise('/user');

  $stateProvider
    .state('user', {
      url: '/user',
      templateUrl: 'assets/views/user/user.html',
      controller: 'UserController',
      controllerAs: 'user',
      resolve: {
        sessionActive: checkSession
      }
    })
    .state('edit', {
      url: '/edit/:trackId',
      templateUrl: 'assets/views/edit/edit.html',
      controller: 'EditController',
      controllerAs: 'edit',
      resolve: {
        sessionActive: checkSession
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'assets/views/login/login.html',
      controller: 'AuthController',
      controllerAs: 'auth'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'assets/views/signup/signup.html',
      controller: 'AuthController',
      controllerAs: 'auth'
    })
    .state('search', {
      url: '/search',
      templateUrl: 'assets/views/search/search.html',
      controller: 'SearchController',
      controllerAs: 'search'
    })
    .state('profile', {
      url: '/profile/:profileId',
      templateUrl: 'assets/views/profile/profile.html',
      controller: 'ProfileController',
      controllerAs: 'profile'
    });
});