angular.module('searchModule', [])
.controller('searchController', function($scope, $http){
  $scope.results = {}

  $scope.searchAll = function(query){
    $http({
      method: 'POST',
      url: '/search',
      data: {query: query}
    }).then(function(data){
      $scope.results.songs = data.data.songs;
      $scope.results.users = data.data.users
      console.log($scope.results)
    })
  }

  $scope.navTo = function(item){
    console.log(item)
  }
})