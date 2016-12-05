angular.module('services', [])

.factory('SongPostFactory', function($http){
  return{
    postSong: function(data){
      return $http({
        method: 'POST',
        url: '/demoRoute',
        data: JSON.stringify({clientText: data})
      })
      .then(function(err) {
        if (err) {
          throw err;
        }
      })
    }
  }
})