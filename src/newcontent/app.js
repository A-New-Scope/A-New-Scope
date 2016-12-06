angular.module('demoApp', ['ui.router', 'demoModule'])

.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/demo')

  $stateProvider
    .state('demo', {
      url: '/demo',
      templateUrl: './demo.html',
      controller: 'demoController'
    })
})