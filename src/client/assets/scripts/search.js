angular.module('SearchModule', [])
.controller('SearchController', function($http, $state) {
  let vm = this;
  vm.results = {};
  vm.songMessage = '';
  vm.userMessage = '';

  vm.searchAll = function(query) {
    vm.songMessage = '';
    vm.userMessage = '';
    $http({
      method: 'POST',
      url: '/search',
      data: {query: query}
    }).then(function(data) {
      vm.results.songs = data.data.songs;
      vm.results.users = data.data.users;
      if (data.data.songs.length > 0) {
        vm.songMessage = 'songs found';
      }
      if (data.data.users !== null) {
        vm.userMessage = 'users found';
      }
    });
  };

  vm.navTo = function(item) {
    $state.go('profile', {profileId: item});
  };
});