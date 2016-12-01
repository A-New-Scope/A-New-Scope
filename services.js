angular.module('services', [])

.factory('SongPostService', function($http){
  return{
    postSong: function(data){
      return $http({
        method: 'POST',
        url: '/demoRoute',
        data: JSON.stringify({song_url: data})
      })
      .then(function(err) {
        if (err) {
          throw err;
        }
      })
    },

    getSongs: function(){
      return $http({
        method: 'GET',
        url: '/demoRoute'
      })
      .then(function(data, err) {
        if (err) {
          throw err;
        }
        return data;
      })
    }
  }
})