/////////////////////////DEPENDENCIES///////////////////////

var express = require('express')
var session = require('express-session')
var mongoose = require('mongoose')
var fs = require('fs')
var bcrypt = require('bcrypt')
var Grid = require('gridfs-stream')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var multer  = require('multer')
var passport = require('passport')
var LocalStrategy   = require('passport-local').Strategy;
var flash    = require('connect-flash')
var app = express()

//////////////////////////MULTER////////////////////////////

var storage = multer.diskStorage({
  destination: 'uploads/', //-destination folder
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
app.use(express.static(__dirname));
app.listen(8000)

console.log("running on 8000")

//////////////////////////UPLOAD////////////////////////////

app.post('/upload', upload, function(req, res){
  if(!req.files[0]){
    res.redirect('/#/demo')
  } else {
    var temp = req.files[0].originalname
    var writestream = gfs.createWriteStream({
            filename: temp //filename to store in mongodb
        //add user and animation fields HERE
    })
    fs.createReadStream('./uploads/' + temp).pipe(writestream)
    writestream.on('close', function (file) {
      console.log(file.filename + ' Written To DB')
      fs.unlink('./uploads/' + temp)
      res.redirect('/#/demo')
    })
  }
})

app.post('/search', function(req, res){
  fsFile.find({filename: req.body.query + '.mp3'}).then(function(data){ //search db
    if(!data[0]){
      console.log("file not in db")
      res.redirect("/#demo")
    } else {
      var writestream = fs.createWriteStream('./uploads/'+req.body.query+'.mp3') //write to uploads folder
      var readstream = gfs.createReadStream({ //read from mongodb
        filename: req.body.query + '.mp3' //(handle multiples eventually by querying by id)
        //search by user, search by animation HERE
      })
      readstream.pipe(writestream)
      writestream.on('close', function () {
        console.log(req.body.query + ' written to uploads');
        res.redirect('/#/success')
      })
    }
  })
})

////////////////////////PASSPORT////////////////////////////

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

passport.serializeUser(function(user, done) { //for session use
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
  res.send("authorized")
})

app.get('/logout', function(req, res){
  req.logout()
  res.end()
})

function isLoggedIn(req, res, next) { //check session active
  console.log(req.session.passport ? "session: " + req.session.passport.user : "no session active")
  //req.session.passport.user stores the session username, undefined otherwise
  //can use session name to query and display appropriate data
  if (req.isAuthenticated()){
    return next();
  }
  res.send("unauthorized")
}

////////////////////////////////////////////////////////////