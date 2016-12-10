angular.module('ProfileModule', [])

.factory('ProfileFactory', function($http) {
  let factory = {};

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

  factory.publicCollection = function(username) {
    return $http.post('/publicCollection', {
      username
    });
  };

  return factory;
})
.controller('ProfileController', function(ProfileFactory, $stateParams) { 
  let vm = this;
  // vm.profilePicture = null;
  vm.profileId = $stateParams.profileId;
  vm.displayMsg = `profile for ${vm.profileId}`;
  vm.collectionData = [];

  vm.importSong = function(filename, songName) {
    ProfileFactory.importSong.call(vm, vm.profileId, filename, songName);
  };

  vm.publicCollection = ProfileFactory.publicCollection(vm.profileId)
  .then(function(data) {
    if (!data.data.length) {
      vm.displayMsg = 'user not found!';
    }
    data.data.forEach(function(item) {
      vm.collectionData.push({
        filename: item.filename,
        username: item.metadata.username,
        songName: item.metadata.songName
      });
    });
  });

  /*  BUGGY PROFILE PICTURE
  
  vm.importPicture = function() {
    $http({
      method: 'POST',
      url: '/importPicture',
      data: {
        username: $stateParams.profileId
      }
    }).then(function(res) {
      if (res.data) {
        vm.profilePicture = 'imports/' + $stateParams.profileId + '.png';
      }
    });
  };

  vm.importPicture();
  */

});