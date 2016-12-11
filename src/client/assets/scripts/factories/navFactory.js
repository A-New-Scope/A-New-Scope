angular.module('Factories')

.factory('NavFactory', function($http, $state) {

  let factory = {};

  /**
   * Navigate to other users' profile pages.
   *
   * @param      {string}  name    The name
   */
  factory.navTo = function(name) {
    $state.go('profile', {profileId: name});
  };

  /**
   * Navigate to your profile.
   */
  factory.navToProfile = function() {
    $http.get('/getCurrentUsername')
    .then(function(data) {
      $state.go('profile', {profileId: data.data});
    });
  };

  return factory;

});