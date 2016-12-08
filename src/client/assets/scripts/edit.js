angular.module('editModule', [])
.controller('editController', function($scope, $http, $stateParams, $state){
  $scope.trackId = $stateParams.trackId
 //edit name
 //delete track
 $scope.deleteSong = function(){
  $http({
    method: 'POST',
    url: '/removeSong',
    data: {songName: $scope.trackId}
  }).then(function(){
    $state.go('user')
  })
 }

 $scope.updateSong = function(newName){
  $http({
    method: 'POST',
    url: '/updateSong',
    data: {
      songName: $scope.trackId,
      newName: newName
    }
  }).then(function(){
    $state.go('user')
  })
 }
})