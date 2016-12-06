angular.module('demoModule', [])

.controller('demoController', function($scope, $http){
  $scope.import = function(query){
    $http({
      method: 'POST',
      url: '/search',
      data: {query: query} //handle animation config and user later
    }).then(function(){
      audio.src = './uploads/' + query + '.mp3'
    })
  }
});