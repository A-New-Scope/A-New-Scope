angular.module('demoModule', [])

.controller('demoController', function($scope, $http, $state){
  $scope.import = function(query){
    $http({
      method: 'POST',
      url: '/search',
      data: {query: query} //handle animation config and user later
    }).then(function(){
      audio.src = './uploads/' + query + '.mp3'
    })
  }

  $scope.logout = function(){ //MOVE TO FACTORY LATER
    $http({
      method: 'GET',
      url: '/logout'
    })
    audio.src = null
    $state.go('login')
  }
});