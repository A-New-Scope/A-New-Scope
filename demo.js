angular.module('demoModule', [])

.controller('demoController', function($scope, $http){
  // $scope.get = function(){
  //   $http.get('/areyouready').then(function(res){
  //     console.log(res.data)
  //     audio.src = './uploads/' + res.data
  //   })
  // }

  // $scope.search = function(query){
  //   audio.src = './uploads/' + query + '.mp3'
  // }

  $scope.import = function(query){
    $http({
      method: 'POST',
      url: '/search',
      data: {query: query}
    }).then(function(){
      //$scope.search(query)
      audio.src = './uploads/' + query + '.mp3'
      //audio.src = './uploads/temp.mp3'
    })
  }
});