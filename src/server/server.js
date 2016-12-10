/* eslint-disable no-console, angular/log, angular/interval-service */

//TO DO
//LEARN MODULE.EXPORTS SUCKER --THIS FILE IS HUGE
//FLASH SUCCESS/FAILURE MESSAGES ON EDIT AND LOGIN/SIGNUP

/////////////////////////DEPENDENCIES///////////////////////

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const Grid = require('gridfs-stream');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash'); //not used...yet
const del = require('del');
const path = require('path');

const app = express();
//////////////////////////MULTER////////////////////////////

const storage = multer.diskStorage({
  destination: 'uploadTemp/', //-destination folder
  filename(req, file, cb) {
    cb(null, file.originalname); //-keep original filename + extension
  }
});
const upload = multer({ storage }).any();

//////////////////////////CONFIG////////////////////////////

mongoose.connect('mongodb://localhost/tracks');
const conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
const gfs = Grid(conn.db);
const fsFile = mongoose.model('fs.file', new mongoose.Schema());

app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

const port = process.env.PORT || 3300;
app.listen(port);

console.log('running on ', port);

////////////////////////PASSPORT////////////////////////////

//-USER SCHEMA
const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

userSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

//-SESSIONS
passport.serializeUser((user, done) => { //for session use
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const isLoggedIn = (req, res, next) => { //check session active
  if (req.isAuthenticated()) {
    return next();
  }
  res.send('unauthorized');
};

//-AUTH
passport.use('login',
  new LocalStrategy((username, password, done) => {
    User.findOne({
      'username': username
    }, (err, data) => {
      if (!data) {
        console.log('user not found');
        return done(null, false);
      }
      if (!data.comparePassword(password)) {
        console.log('invalid password');
        return done(null, false);
      } else {
        return done(null, username);
      }
    });
  })
);

passport.use('signup', new LocalStrategy((username, password, done) => {
  process.nextTick(() => {
    User.find({'username': username}, (err, data) => {
      if (!data.length) {
        const temp = new User({ //create a new user to store in db
          username
        });
        temp.password = temp.generateHash(password);
        temp.save(err => {
          if (err) {
            throw err;
          }
          console.log('registered user', username);
          return done(null, username);
        });
      } else {
        console.log('user already exists');
        return done(null, false);
      }
    });
  });
}));

app.post('/login', passport.authenticate('login'), (req, res) => {
  res.end();
});

app.post('/signup', passport.authenticate('signup'), (req, res) => {
  res.end();
});

app.get('/auth', isLoggedIn, (req, res) => {
  res.end();
});

/**
 * Uses built-in Passport functionality to log out.
 */
app.get('/logout', (req, res) => {
  req.logout();
  res.end();
});

//-CLEAR IMPORTS PERIODICALLY
setInterval(() => {
  del(['./src/client/imports/*']).then(data => {
    console.log('imports cleared', data);
  });
}, 300000); //clear imports every 5 minutes
            //
//////////////////////////UPLOAD////////////////////////////

//--UPLOAD SONG
app.post('/upload', isLoggedIn, upload, (req, res) => {
  if (!req.files[0]) {
    res.redirect('/#/user');
  } else {
    const temp = req.files[0].originalname;
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
  });
});


// BUGGY: PROFILE PICTURE
/*app.post('/uploadPicture', isLoggedIn, upload, (req, res) => {
  console.log(req.files[0]);
  if (!req.files[0]) {
    res.redirect('/#/user');
  } else {
    const temp = req.files[0].originalname;
    const writestream = gfs.createWriteStream({
        //filename to store in mongodb
      metadata: {
        username: req.session.passport.user,
        type: 'image'
      }
    });
    fs.createReadStream(`./uploadTemp/${temp}`).pipe(writestream);
    writestream.on('close', file => {
      console.log(`${file} written To DB`);
      fs.unlink(`./uploadTemp/${temp}`);
      res.redirect('/#/user');
    });
  }
});

app.post('/importPicture', (req, res) => {
  // if(req.body === null){
  //   req.body.username = req.session.passport.user
  // }
  console.log('username', req.body.username);
  fsFile.find({
    'metadata.username': req.body.username,
    'metadata.type': 'image'
  }).then(data => { //search db
    if (!data[0]) {
      console.log('file not in db');
      res.end();
    } else {
      const writestream = fs.createWriteStream(`./src/client/imports/${req.body.username}.png`); //write to imports folder
      const readstream = gfs.createReadStream({ //read from mongodb
        filename: req.body.filename
      });
      readstream.pipe(writestream);
      writestream.on('close', () => {
        console.log(`${req.body.username}.png written to imports`);
        res.end('success');
      });
    }
  });
});

app.get('/removePicture', isLoggedIn, (req, res) => {
  fsFile.remove({
    'metadata.username': req.session.passport.user,
    'metadata.type': 'image'
  }).then(() => {
    res.end();
  });
});*/



app.get('/getUserCollection', isLoggedIn, (req, res) => {
  fsFile.find({'metadata.username': req.session.passport.user})
  .then(data => {
    res.send(data);
  });
});

app.post('/updateSongName', isLoggedIn, (req, res) => {
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
  });
});

app.post('/removeSong', isLoggedIn, (req, res) => {
  fsFile.remove({
    'metadata.username': req.session.passport.user,
    'metadata.songName': req.body.songName
  }).then(() => {
    res.end();
  });
});

app.post('/publicCollection', (req, res) => {
  fsFile.find({
    'metadata.username': req.body.username
  }).then(data => {
    res.send(data);
  });
});

app.post('/search', (req, res) => {
  const query = req.body.query;
  const temp = {};
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
  });
});

app.get('/getCurrentSession', isLoggedIn, (req, res) => {
  console.log('res of /getCurrentSession is ', res);
  console.log('req.session.passport.user is ', req.session.passport.user);
  res.send(req.session.passport.user);
});


////////////////////////////////////////////////////////////