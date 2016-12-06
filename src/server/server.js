let express = require('express');
let session = require('express-session');
let mongoose = require('mongoose');
let fs = require('fs');
let Grid = require('gridfs-stream');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let multer = require('multer');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let flash = require('connect-flash');

let app = express();

//////////////////////////MULTER////////////////////////////

let storage = multer.diskStorage({
  destination: 'uploads/', //-destination folder
  filename: function(req, file, cb){
    cb(null, file.originalname) //-keep original filename + extension
  }
})
let upload = multer({
  storage: storage
}).any()

//////////////////////////CONFIG////////////////////////////

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
app.use(express.static('src/client'));
app.listen(3300)

console.log("running on 3300")

mongoose.connect('mongodb://localhost/tracks');
var conn = mongoose.connection
Grid.mongo = mongoose.mongo
var gfs = Grid(conn.db)
var fsFile = mongoose.model('fs.file', new mongoose.Schema())

//////////////////////////UPLOAD////////////////////////////

app.post('/upload', upload, function(req, res){
  if(!req.files[0]){
    res.redirect('/#/demo')
  } else{
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

//todo- create user schema with generate password and check password methods

passport.serializeUser(function(user, done) { //for session use
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('login', //login strategy --set to admin for now (no schema/db save)
  new LocalStrategy(function(username, password, done){
  console.log("username: ", username)
  console.log("password: ", password)
  if(username !== "admin" || password !== "admin"){
    console.log("auth failed")
    return done(null, false)
  } else {
    console.log("success")
    return done(null, username)
  }
}))

app.post('/login', passport.authenticate('login'), function(req, res){
  res.end()
})

app.post('/signup', function(req, res){
  //check db for duplicates
  //hash and save credentials if valid
  console.log("placeholder route")
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