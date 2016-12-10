/*  
BUGGY PROFILE PICTURE FEATURES

factory.importPicture = function(username) {
    $log.debug('inside importPicture, username is ', username);
    $http.post('/importPicture', {username: username})
    .then(function (res) {
      $log.debug('and res is ', res);
    });
  };

    factory.removePicture = function() {
    $http.get('/removePicture');
  };*/