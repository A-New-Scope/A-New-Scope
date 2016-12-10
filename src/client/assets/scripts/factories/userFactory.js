angular.module('Factories')

.factory('UserFactory', function ($http) {

  let factory = {};

  /* Originally in UserFactory */
  // gets username ⇒ change to getUsername
  // was used for profile pic functionality; not currently used
  factory.getCurrentSession = function() {
    return $http.get('/getCurrentSession');
  };

  /* Originally in UserFactory */
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

  /* Originally in ProfileFactory */
  factory.getPublicCollection = function(username) {
    return $http.post('/getPublicCollection', {
      username
    });
  };

  return factory;

});