angular.module('SearchModule', [])

.factory('SearchFactory', function ($http, $state) {
  let factory = {};

  factory.searchAll = function(query) {
    return $http.post('/search', {query: query});
  };

  factory.navTo = function(item) {
    $state.go('profile', {profileId: item});
  };

  return factory;

})
.controller('SearchController', function(SearchFactory) {
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
      if (data.data.songs.length > 0) {
        vm.songMessage = 'songs found';
      }
      if (data.data.users !== null) {
        vm.userMessage = 'users found';
      }
    });
  };
});