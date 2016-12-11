angular.module('Controllers')

/**
 * Controller for a song-specific edit page that allows for updating
 * the name of the song and deleting the song reference from the
 * database.
 */
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