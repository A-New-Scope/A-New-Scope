angular.module('Controllers')

.controller('SearchController', function(SearchFactory, NavFactory) {
  let vm = this;
  vm.results = {};
  vm.songMessage = '';
  vm.userMessage = '';

  vm.searchAll = function (input) {
    vm.songMessage = '';
    vm.userMessage = '';
    SearchFactory.searchAll(input)
    .then(function(data) {
      vm.results.songs = data.data.songs;
      vm.results.users = data.data.users;
      if (vm.results.songs.length > 0) {
        vm.songMessage = 'songs found';
      }
      if (vm.results.users !== null) {
        vm.userMessage = 'users found';
      }
    });
  };

  vm.navTo = NavFactory.navTo;
});