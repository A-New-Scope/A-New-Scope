angular.module('Factories')

.factory('UserFactory', function ($http) {

  let factory = {};

  /* Originally in UserFactory */
  // gets username ⇒ change to getUsername
  // was used for profile pic functionality; not currently used
  factory.getCurrentSession = function() {
    return $http.get('/getCurrentSession');
  };

  /**
   * Gets the session-specific user collection that displays songs
   * on your dashboard. You need to be logged in to see it.
   *
   * @param      {Array}  collectionData  The collection data
   */
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

  /**
   * Gets the public collection, which displays public profile.
   * It is not session-dependent, so you don't need to be logged in
   * to see it.
   *
   * @param      {<type>}  username  The username
   * @return     {<type>}  The public collection.
   */
  factory.getPublicCollection = function(username) {
    return $http.post('/getPublicCollection', {
      username
    });
  };

  return factory;

});