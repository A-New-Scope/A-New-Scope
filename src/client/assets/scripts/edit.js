angular.module('EditModule', [])

.factory('EditFactory', function($http, $state) {
  let factory = {};

  factory.deleteSong = function () {

  };

  factory.updateSongName = function () {

  };

  return factory;
})
.controller('EditController', function(EditFactory, $http, $state, $stateParams) {
  let vm = this;
  vm.trackId = $stateParams.trackId;
 //edit name
 //delete track
  vm.deleteSong = function() {
    $http.post('/removeSong', {
      songName: vm.trackId
    })
    .then(function() {
      $state.go('user');
    });
  };

  vm.updateSongName = function(newName) {
    $http.post('/updateSongName', {
      songName: vm.trackId,
      newName: newName
    })
    .then(function() {
      $state.go('user');
    });
  };
});