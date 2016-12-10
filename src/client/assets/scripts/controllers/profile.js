angular.module('Controllers')

.controller('ProfileController', function(UserFactory, SongFactory, $stateParams) { 
  let vm = this;
  // vm.profilePicture = null;

  vm.username = $stateParams.profileId;
  
  vm.displayMsg = `profile for ${vm.username}`;


  vm.collectionData = [];

/**
 * When a listed song in collectionData is clicked, 
 * this function imports the file from the database into 
 * /assets/imports and autoplays that song.
 *
 * @param      {string}  filename  The filename
 * @param      {string}  songName  The song name
 */
  vm.importSong = function(filename, songName) {
    SongFactory.importSong.call(vm, vm.username, filename, songName);
  };

/**
 * Immediately instantiated function that populates vm.collectionData
 * with a list of uploaded 
 */
  vm.getPublicCollection = UserFactory.getPublicCollection(vm.username)
  .then(function(data) {
    if (!data.data.length) {
      vm.displayMsg = 'user not found!';
    }
    data.data.forEach(function(item) {
      vm.collectionData.push({
        filename: item.filename,
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