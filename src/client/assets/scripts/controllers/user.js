angular.module('Controllers')

.controller('UserController', function(AuthFactory, NavFactory, SongFactory, UserFactory) {
  let vm = this;
  vm.collectionData = [];

  vm.getUserCollection = UserFactory.getUserCollection(vm.collectionData);

  vm.editSong = SongFactory.editSong;

  vm.logout = AuthFactory.logout;

  vm.navToProfile = NavFactory.navToProfile;
  
  // vm.profilePicture = null;
});