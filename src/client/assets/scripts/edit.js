angular.module('Controllers')

.controller('EditController', function(SongFactory, $stateParams) {
  let vm = this;
  vm.trackId = $stateParams.trackId;

  vm.deleteSong = function(trackId) {
    SongFactory.deleteSong(trackId);
  };

  vm.updateSongName = function(newName) {
    SongFactory.updateSongName.call(vm, vm.trackId, newName);
  };

});