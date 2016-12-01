angular.module('demoModule', ['services'])

.controller('demoController', function($scope, SongPostService){
  $scope.song_url = ""
  $scope.allSongs = null

  $scope.postSong = function(data){
    SongPostService.postSong(data)
    $scope.song_url = ""
  }

  $scope.getSongs = function(){
    SongPostService.getSongs().then(function(data, err){
      if(err){
        throw err
      }
      $scope.allSongs = [];
      data.data.forEach(function(item){
        $scope.allSongs.push(item.song_url)
      })
    })
  }
});