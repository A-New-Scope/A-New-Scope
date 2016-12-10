angular.module('ProfileModule', [])
.controller('ProfileController', function($http, $stateParams) { 
  let vm = this;
  // vm.profilePicture = null;
  vm.profileId = $stateParams.profileId;
  vm.displayMsg = 'profile for ' + $stateParams.profileId;
  vm.collectionData = [];

  vm.import = function(filename, songName) {
    $http({
      method: 'POST',
      url: '/import',
      data: {
        username: $stateParams.profileId,
        filename: filename,
        songName: songName
      } //handle animation later
    }).then(function(res) {
      if (res.data) {
        audio.src = 'imports/' + filename;
      }
    });
  };

  vm.publicCollection = function() {
    $http({
      method: 'POST',
      url: '/publicCollection',
      data: {username: $stateParams.profileId}
    }).then(function(data) {
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
  };

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
  vm.publicCollection();
});