angular.module('Factories')

.factory('SongFactory', function($http, $state) {
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

  /**
   * Imports song, which then autoplays (see audio.js).
   *
   * @param      {string}  username  The username
   * @param      {string}  filename  The filename
   * @param      {string}  songName  The song name
   */
  factory.importSong = function(username, filename, songName) {
    $http.post('/importSong', {
      username: username,
      filename: filename,
      songName: songName
    })
    .then(function(res) {
      if (res.data) {
        audio.src = 'imports/' + filename;
      }
    });
  };

  /**
   * Go to song-specific edit page
   *
   * @param      {string}  songName  The song name
   */
  factory.editSong = function(songName) {
    $state.go('edit', {trackId: songName});
  };

  return factory;

});