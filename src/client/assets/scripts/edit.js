angular.module('EditModule', [])

.factory('EditFactory', function($http, $state) {
  let factory = {};

  factory.deleteSong = function(trackId) {
    $http.post('/removeSong', {
      songName: trackId
    })
    .then(function() {
      $state.go('user');
    });
  };

  factory.updateSongName = function(trackId, newName) {
    $http.post('/updateSongName', {
      songName: trackId,
      newName: newName
    })
    .then(function() {
      $state.go('user');
    });
  };

  return factory;
})
.controller('EditController', function(EditFactory, $stateParams) {
  let vm = this;
  vm.trackId = $stateParams.trackId;

  vm.deleteSong = function(trackId) {
    EditFactory.deleteSong(trackId);
  };

  vm.updateSongName = function(newName) {
    EditFactory.updateSongName.call(vm, vm.trackId, newName);
  };

});