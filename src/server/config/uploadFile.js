const fs = require('fs');
const passportFile = require('./passportFile.js');
const upload = require('./multerPath.js');


module.exports = function(app, express, gfs, fsFile) {
  //--UPLOAD SONG
  app.post('/upload', passportFile.isLoggedIn, upload, (req, res) => {
    if (!req.files[0]) {
      res.redirect('/#/user');
    } else {
      var temp = req.files[0].originalname;
      const writestream = gfs.createWriteStream({
        filename: temp, //filename to store in mongodb
        metadata: {
          username: req.session.passport.user,
          songName: req.body.songName
        } //username from session, store more specs in here
      });
      fs.createReadStream(`./uploadTemp/${temp}`).pipe(writestream);
      writestream.on('close', file => {
        console.log(`${file.filename} written To DB`);
        fs.unlink(`./uploadTemp/${temp}`);
        res.redirect('/#/user');
      });
    }
  });

  app.post('/importSong', (req, res) => {
    fsFile.find({
      filename: req.body.filename,
      'metadata.username': req.body.username,
      'metadata.songName': req.body.songName
    }).then(data => { //search db
      if (!data[0]) {
        console.log('file not in db');
        res.end();
      } else {
        const writestream = fs.createWriteStream(`./src/client/imports/${req.body.filename}`); //write to imports folder
        const readstream = gfs.createReadStream({ //read from mongodb
          filename: req.body.filename
          //search by user, search by animation HERE
        });
        readstream.pipe(writestream);
        writestream.on('close', () => {
          console.log(`${req.body.filename} written to imports`);
          res.end('success');
        });
      }
    }).catch(err => {
      throw err;
    });
  });

  app.get('/getUserCollection', passportFile.isLoggedIn, (req, res) => {
    fsFile.find({'metadata.username': req.session.passport.user})
    .then(data => {
      res.send(data);
    }).catch(err => {
      throw err;
    });
  });

  app.post('/updateSongName', passportFile.isLoggedIn, (req, res) => {
    gfs.files.update(
      {
        'metadata.songName': req.body.songName,
        'metadata.username': req.session.passport.user
      },
      { 
        $set: {
          'metadata.songName': req.body.newName
        }
      }
    ).then(() => {
      res.end();
    }).catch(err => {
      throw err;
    });
  });

/**
 * Please note that route only removes song metadata from the
 * database. The song itself is not deleted. To clear the 
 * song file itself from the database, you need to delete fs.chunks.
 */

  app.post('/removeSong', passportFile.isLoggedIn, (req, res) => {
    fsFile.remove({
      'metadata.username': req.session.passport.user,
      'metadata.songName': req.body.songName
    }).then(() => {
      res.end();
    }).catch(err => {
      throw err;
    });
  });

  app.post('/getPublicCollection', (req, res) => {
    fsFile.find({
      'metadata.username': req.body.username
    }).then(data => {
      res.send(data);
    }).catch(err => {
      throw err;
    });
  });
  
/**
 * Serve an object with song names and usernames that match
 * the query.
 */
  app.post('/search', (req, res) => {
    const query = req.body.query;
    var temp = {};
    fsFile.find({
      'metadata.songName': query
    }).then(songdata => { //find songs
      temp.songs = songdata;
      fsFile.find({
        'metadata.username': query
      }).then(userdata => { //find users
        temp.users = userdata.length > 0 ? query : null;
        res.send(temp);
      });
    }).catch(err => {
      throw err;
    });
  });
};