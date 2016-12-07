angular.module('profileModule', [])
.controller('profileController', function($scope, $http, $stateParams){
  $scope.profileId = $stateParams.profileId
  $scope.collectionData = []

  $scope.import = function(filename, songName){
    $http({
      method: 'POST',
      url: '/import',
      data: {
        username: $scope.profileId,
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
      data: {username: $scope.profileId}
    }).then(function(data){
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