angular.module('demoModule', [])

.controller('demoController', function($scope, $http){
  $scope.import = function(query){
    $http({
      method: 'POST',
      url: '/search',
      data: {query: query}
    }).then(function(){
      audio.src = './uploads/' + query + '.mp3'
      //audio.src = './uploads/temp.mp3'
    })
  }
});