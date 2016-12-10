angular.module('Factories')

.factory('SearchFactory', function ($http) {
  let factory = {};
  
  /**
   * Queries the database for username and song names.
   * Returns req object.
   *
   * @param      {string}  query   User-facing input of: username or song
   * @return     {server req obj}  { data: { songs: {...}, users: {...} } }
   */
  factory.searchAll = function(query) {
    return $http.post('/search', {query: query});
  };

  return factory;

});