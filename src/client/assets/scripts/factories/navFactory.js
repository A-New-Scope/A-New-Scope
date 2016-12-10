angular.module('Factories')

.factory('NavFactory', function($http, $state) {

  let factory = {};

  // originally in search.js
  // navigate to other users' profiles
  factory.navTo = function(item) {
    $state.go('profile', {profileId: item});
  };

  // originally in UserFactory
  // navigate to your profile
  factory.navToProfile = function() {
    $http.get('/getCurrentSession')
    .then(function(data) {
      $state.go('profile', {profileId: data.data});
    });
  };

  return factory;

});