angular.module('UserModule', [])

.factory('UserFactory', function($http, $state) {

  let factory = {};

  factory.editSong = function(songName) {
    $state.go('edit', {trackId: songName});
  };

  factory.logout = function() {
    $http.get('/logout')
    .then($state.go('login'));
  };

  factory.getUserCollection = function(collectionData) {
    $http.get('/getUserCollection')
    .then(function(data) {
      data.data.forEach(function(item) {
        collectionData.push({
          filename: item.filename,
          username: item.metadata.username,
          songName: item.metadata.songName
        });
      });
    });
  };

  factory.navToProfile = function() {
    $http.get('/getCurrentSession')
    .then(function(data) {
      $state.go('profile', {profileId: data.data});
    });
  };

  factory.getCurrentSession = function() {
    return $http.get('/getCurrentSession');
  };

  return factory;

})

.controller('UserController', function(UserFactory) {
  let vm = this;
  vm.collectionData = [];
  // vm.profilePicture = null;

  vm.getUserCollection = UserFactory.getUserCollection(vm.collectionData);

  vm.editSong = UserFactory.editSong;

  vm.logout = UserFactory.logout;

  vm.navToProfile = UserFactory.navToProfile;

});