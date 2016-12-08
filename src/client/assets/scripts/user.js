angular.module('userModule', [])

.controller('userController', function($scope, $http, $state){
  $scope.collectionData = []
  $scope.profilePicture = null

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

  $scope.getCurrentSession = function(){
    $http({
      method: 'GET',
      url: '/getCurrentSession'
    }).then(function(res){
      $scope.importPicture(res.data)
    })
  }

  $scope.importPicture = function(username){
    $http({
      method: 'POST',
      url: '/importPicture',
      data: {
        username: username
      }
    }).then(function(data){
      if(data.data){
        $scope.profilePicture = 'imports/' + username + '.png'
      }
    })
  }

  $scope.removePicture = function(){
    $http({
      method: 'GET',
      url: '/removePicture'
    }).then(function(){
      $scope.profilePicture = null
    })
  }


  $scope.getCurrentSession();
  $scope.userCollection()
  // $scope.importPicture($scope.currentSession)
});