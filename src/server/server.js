//TO DO
//LEARN MODULE.EXPORTS SUCKER --THIS FILE IS HUGE
//FLASH SUCCESS/FAILURE MESSAGES ON EDIT AND LOGIN/SIGNUP

/////////////////////////DEPENDENCIES///////////////////////

var express = require('express')
var session = require('express-session')
var mongoose = require('mongoose')
var fs = require('fs')
var bcrypt = require('bcrypt-nodejs')
var Grid = require('gridfs-stream')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var multer = require('multer')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash') //not used...yet
var del = require('del')
var app = express()
var path = require('path');

//////////////////////////MULTER////////////////////////////

var storage = multer.diskStorage({
  destination: 'uploadTemp/', //-destination folder
  filename: function(req, file, cb){
    cb(null, file.originalname) //-keep original filename + extension
  }
})
var upload = multer({
  storage: storage
}).any()

//////////////////////////CONFIG////////////////////////////

mongoose.connect('mongodb://localhost/tracks')
var conn = mongoose.connection
Grid.mongo = mongoose.mongo
var gfs = Grid(conn.db)
var fsFile = mongoose.model('fs.file', new mongoose.Schema())

app.use(cookieParser()) // read cookies (needed for auth)
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client')));

const port = process.env.PORT || 3300;
app.listen(port);

console.log("running on ", port)

//////////////////////////UPLOAD////////////////////////////

//--UPLOAD SONG
app.post('/upload', isLoggedIn, upload, function(req, res){
  if(!req.files[0]){
    res.redirect('/#/user')
  } else{
    var temp = req.files[0].originalname
    var writestream = gfs.createWriteStream({
        filename: temp, //filename to store in mongodb
        metadata: {
        username: req.session.passport.user,
        songName: req.body.songName
        }//username from session, store more specs in here
    })
    fs.createReadStream('./uploadTemp/' + temp).pipe(writestream)
    writestream.on('close', function (file) {
      console.log(file.filename + ' Written To DB')
      fs.unlink('./uploadTemp/' + temp)
      res.redirect('/#/user')
    })
  }
})

app.post('/import', function(req, res){
  fsFile.find({
    filename: req.body.filename,
    "metadata.username": req.body.username,
    "metadata.songName": req.body.songName
  }).then(function(data){ //search db
    if(!data[0]){
      console.log("file not in db")
      res.end()
    } else {
      var writestream = fs.createWriteStream('./src/client/imports/'+req.body.filename) //write to imports folder
      var readstream = gfs.createReadStream({ //read from mongodb
        filename: req.body.filename
        //search by user, search by animation HERE
      })
      readstream.pipe(writestream)
      writestream.on('close', function () {
        console.log(req.body.filename + ' written to imports');
        res.end("success")
      })
    }
  })
})


//-UPLOAD PROFILE PICTURE
app.post('/uploadPicture', isLoggedIn, upload, function(req, res){
  console.log(req.files[0])
  if(!req.files[0]){
    res.redirect('/#/user')
  } else{
    var temp = req.files[0].originalname
    var writestream = gfs.createWriteStream({
        //filename to store in mongodb
        metadata: {
          username: req.session.passport.user,
          type: "image"
        }
    })
    fs.createReadStream('./uploadTemp/' + temp).pipe(writestream)
    writestream.on('close', function (file) {
      console.log(file + ' Written To DB')
      fs.unlink('./uploadTemp/' + temp)
      res.redirect('/#/user')
    })
  }
})

app.post('/importPicture', function(req, res){
  // if(req.body === null){
  //   req.body.username = req.session.passport.user
  // }
  console.log("username", req.body.username)
  fsFile.find({
    "metadata.username": req.body.username,
    "metadata.type": "image"
  }).then(function(data){ //search db
    if(!data[0]){
      console.log("file not in db")
      res.end()
    } else {
      var writestream = fs.createWriteStream('./src/client/imports/'+req.body.username+'.png') //write to importss folder
      var readstream = gfs.createReadStream({ //read from mongodb
        filename: req.body.filename
      })
      readstream.pipe(writestream)
      writestream.on('close', function () {
        console.log(req.body.username + '.png written to imports');
        res.end("success")
      })
    }
  })
})

app.get('/removePicture', isLoggedIn, function(req, res){
  fsFile.remove({
    "metadata.username": req.session.passport.user,
    "metadata.type": "image"
  }).then(function(){
    res.end()
  })
})


app.get('/userCollection', isLoggedIn, function(req, res){
  fsFile.find({"metadata.username": req.session.passport.user}).then(function(data){
    res.send(data)
  })
})

app.post('/updateSongName', isLoggedIn, function(req, res){
  gfs.files.update(
    {
      'metadata.songName': req.body.songName,
      'metadata.username': req.session.passport.user
    },
    { $set: { 'metadata.songName': req.body.newName } }
  ).then(function(){
    res.end()
  })
})

app.post('/removeSong', isLoggedIn, function(req, res){
  fsFile.remove({
    "metadata.username": req.session.passport.user,
    "metadata.songName": req.body.songName
  }).then(function(){
    res.end()
  })
})

app.post('/publicCollection', function(req, res){
  fsFile.find({"metadata.username": req.body.username}).then(function(data){
    res.send(data)
  })
})

app.post('/search', function(req, res){
  var query = req.body.query
  var temp = {};
  fsFile.find({"metadata.songName": query}).then(function(songdata){ //find songs
    temp.songs = songdata
    fsFile.find({"metadata.username": query}).then(function(userdata){ //find users
      temp.users = userdata.length > 0 ? query : null
      res.send(temp)
    })
  })
})

app.get('/getCurrentSession', isLoggedIn, function(req, res){
  res.send(req.session.passport.user)
})

////////////////////////PASSPORT////////////////////////////

//-USER SCHEMA
var userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
})

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password)
}

var User = mongoose.model('User', userSchema)

//-SESSIONS
passport.serializeUser(function(user, done) { //for session use
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function isLoggedIn(req, res, next) { //check session active
  if (req.isAuthenticated()){
    return next();
  }
  res.send("unauthorized")
}

//-AUTH
passport.use('login',
  new LocalStrategy(function(username, password, done){
    User.findOne({'username': username}, function(err, data){
      if(!data){
        console.log("user not found")
        return done(null, false)
      }
      if(!data.comparePassword(password)){
        console.log("invalid password")
        return done(null, false)
      } else {
        return done(null, username)
      }
    })
}))

passport.use('signup', new LocalStrategy(function(username, password, done){
  process.nextTick(function(){
    User.find({'username': username}, function(err, data){
      if(!data.length){
        var temp = new User({ //create a new user to store in db
          username: username
        })
        temp.password = temp.generateHash(password)
        temp.save(function(err){
          if(err){
            throw err
          }
          console.log("registered user", username)
          return done(null, username)
        })
      } else {
        console.log("user already exists")
        return done(null, false)
      }
    })
  })
}))

app.post('/login', passport.authenticate('login'), function(req, res){
  res.end()
})

app.post('/signup', passport.authenticate('signup'), function(req, res){
  res.end()
})

app.get('/auth', isLoggedIn, function(req, res){
  res.end()
})

app.get('/logout', function(req, res){
    req.logout()
    res.end()
})

//-CLEAR IMPORTS PERIODICALLY
setInterval(function(){
  del(['./src/client/imports/*']).then(function(data){
    console.log("imports cleared", data)
  })
}, 300000) //clear imports every 5 minutes
////////////////////////////////////////////////////////////