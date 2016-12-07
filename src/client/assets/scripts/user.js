angular.module('userModule', [])

.controller('userController', function($scope, $http, $state){
  $scope.collectionData = []

  //MAKE SEPERATE SEARCH VIEW LATER
  $scope.import = function(filename, songName){ //INTERNAL METHOD CALLED ON COLLECTION CLICK
    $http({
      method: 'POST',
      url: '/import',
      data: {
        filename: filename,
        songName: songName
      } //handle animation later
    }).then(function(res){
      if(res.data){
        audio.src = 'imports/' + filename
      }

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

  $scope.userCollection = function(){
    $http({
      method: 'GET',
      url: '/userCollection'
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

  $scope.userCollection();
});