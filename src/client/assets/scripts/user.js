angular.module('userModule', [])

.controller('userController', function($scope, $http, $state){
  $scope.collectionData = []

  $scope.edit = function(filename, songName){
    $state.go('edit', {trackId: songName})
  }

  $scope.logout = function(){ //MOVE TO FACTORY LATER
    $http({
      method: 'GET',
      url: '/logout'
    })
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

  $scope.navToProfile = function(){
    $http({
      method: 'GET',
      url: '/getCurrentSession'
    }).then(function(data){
      $state.go('profile', {profileId: data.data})
    })
  }

  $scope.userCollection();
  //add link to public profile
});