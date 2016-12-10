angular.module('UserModule', [])

.controller('UserController', function($http, $state) {
  let vm = this;
  vm.collectionData = [];
  vm.profilePicture = null;

  vm.editSong = function(filename, songName) {
    $state.go('edit', {trackId: songName});
  };

  vm.logout = function() { //MOVE TO FACTORY LATER
    $http({
      method: 'GET',
      url: '/logout'
    });
    $state.go('login');
  };

  vm.userCollection = function() {
    $http({
      method: 'GET',
      url: '/userCollection'
    }).then(function(data) {
      data.data.forEach(function(item) {
        vm.collectionData.push({
          filename: item.filename,
          username: item.metadata.username,
          songName: item.metadata.songName
        });
      });
    });
  };

  vm.navToProfile = function() {
    $http({
      method: 'GET',
      url: '/getCurrentSession'
    }).then(function(data) {
      $state.go('profile', {profileId: data.data});
    });
  };

  vm.importPicture = function(username) {
    $http({
      method: 'POST',
      url: '/importPicture',
      data: {
        username: username
      }
    }).then(function(data) {
      if (data.data) {
        vm.profilePicture = 'imports/' + username + '.png';
      }
    });
  };
  
  vm.getCurrentSession = function() {
    $http({
      method: 'GET',
      url: '/getCurrentSession'
    }).then(function(res) {
      vm.importPicture(res.data);
    });
  };

  vm.removePicture = function() {
    $http({
      method: 'GET',
      url: '/removePicture'
    }).then(function() {
      vm.profilePicture = null;
    });
  };


  vm.getCurrentSession();
  vm.userCollection();
  // vm.importPicture(vm.currentSession)
});