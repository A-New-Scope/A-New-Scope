angular.module('profileModule', [])
.controller('profileController', function($scope, $http, $stateParams){
  $scope.displayMsg = "profile for " + $stateParams.profileId
  $scope.collectionData = []

  $scope.import = function(filename, songName){
    $http({
      method: 'POST',
      url: '/import',
      data: {
        username: $stateParams.profileId,
        filename: filename,
        songName: songName
      } //handle animation later
    }).then(function(res){
      if(res.data){
        audio.src = 'imports/' + filename
      }
    })
  }

  $scope.publicCollection = function(){
    $http({
      method: 'POST',
      url: '/publicCollection',
      data: {username: $stateParams.profileId}
    }).then(function(data){
      if(!data.data.length){
        $scope.displayMsg = "user not found!"
      }
      data.data.forEach(function(item){
        $scope.collectionData.push({
          filename: item.filename,
          username: item.metadata.username,
          songName: item.metadata.songName
        })
      })
    })
  }

  $scope.publicCollection();
})