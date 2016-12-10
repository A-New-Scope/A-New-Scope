angular.module('Controllers')

.controller('ProfileController', function(UserFactory, SongFactory, $stateParams) { 
  let vm = this;
  // vm.profilePicture = null;
  vm.profileId = $stateParams.profileId;
  vm.displayMsg = `profile for ${vm.profileId}`;
  vm.collectionData = [];

  vm.importSong = function(filename, songName) {
    SongFactory.importSong.call(vm, vm.profileId, filename, songName);
  };

  vm.getPublicCollection = UserFactory.getPublicCollection(vm.profileId)
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