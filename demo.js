angular.module('demoModule', [])

.controller('demoController', function($scope, $http){
  // $scope.post = function($http) {
  //     $http({
  //       method: 'POST',
  //       url: '/areyouready',
  //     })
  //     .then(function(data, err){
  //       if(err){
  //         throw err
  //       }
  //       console.log(data)
  //     })
  // }
  $scope.get = function(){
    $http.get('/areyouready').then(function(res){
      console.log(res.data)
      audio.src = './uploads/' + res.data
    })
  }

  $scope.get()
});