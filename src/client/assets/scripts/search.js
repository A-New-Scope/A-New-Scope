angular.module('searchModule', [])
.controller('searchController', function($scope, $http, $state){
  $scope.results = {}
  $scope.songMessage = ""
  $scope.userMessage = ""

  $scope.searchAll = function(query){
    $scope.songMessage = ""
    $scope.userMessage = ""
    $http({
      method: 'POST',
      url: '/search',
      data: {query: query}
    }).then(function(data){
      $scope.results.songs = data.data.songs;
      $scope.results.users = data.data.users
      if(data.data.songs.length > 0){
        $scope.songMessage = "songs found"
      }
      if(data.data.users !== null){
        $scope.userMessage = "users found"
      }
    })
  }

  $scope.navTo = function(item){
    $state.go('profile', {profileId: item})
  }
})