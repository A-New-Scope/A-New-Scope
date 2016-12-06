var mongoose = require('mongoose');
var path = require('path');
var Grid = require('gridfs-stream');
var fs = require('fs');

// establish MongoDB connection
mongoose.connect('mongodb://localhost/tracks');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('We are connected to mongoose');
});

// schema layout
var userSchema = new mongoose.Schema(
  {
  	name: 
		{
		  first: String,
		  last: String
		},
	password: String,
	song: 
	  [
		{
		  songName: String,
		  artistName: String,
		  visual: String  // Needs to store user customization 
		}
	  ]

  }
);

// creating User model/collection
var User = mongoose.model('User', userSchema);

var fsFile = mongoose.model('fs.file', new mongoose.Schema())

// Testing db
var userTest = new User({
	name: 
	{
		first: 'Nicko',
		last: 'Romana'
	},
	password: '1234',
	song:
	  [
	    {
	    	songName: 'Someday',
	    	artistName: 'Sugar Ray',
	    	visual: 'threejs stuff'
	    }
	  ]
	}
);

userTest.save(function(err) {
	if(err) {
		return handleError(err);
	}
});

module.exports = {
	User: User
}

/*
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var Grid = require('gridfs-stream');
var bodyParser = require('body-parser');

//////////////////////////MULTER////////////////////////////

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: 'uploads/', //-destination folder
  filename: function(req, file, cb){
    cb(null, file.originalname) //-keep original filename + extension
  }
})
var upload = multer({
  storage: storage
}).any()

////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost/tracks');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
var fsFile = mongoose.model('fs.file', new mongoose.Schema())

///////////////////////////////////////////////////////////
// schema layout
var userSchema = new mongoose.Schema(
  {
    name: 
    {
      first: String,
      last: String
    },
  password: String,
  song: [fsFile]
    // Make the fsFile have this layout at some point
    // {
    //   filename: temp         <====  so far, line 42 is what we have
    //   songName: String,
    //   artistName: String,
    //   visual: String  // Needs to store user customization 
    // }
  }
);

// creating User model/collection
var User = mongoose.model('User', userSchema);
//////////////////////////////////////////////////////////

app.use(bodyParser.json())
app.use(express.static(__dirname));
app.listen(8000);
console.log("running on 8000");

app.post('/upload', upload, function(req, res){
  if(!req.files[0]){
    res.redirect('/#/demo')
  } else {
    var temp = req.files[0].originalname
    var writestream = gfs.createWriteStream({
        filename: temp //filename to store in mongodb
        //add user and animation fields HERE
    });
    User.find({name: req.body.name}, function(err, data) {
      if(err) {
        throw err
      }
      fs.createReadStream('./uploads/' + temp).pipe(writestream);
      writestream.on('close', function (file) {
        console.log(file.filename + ' Written To DB');
        fs.unlink('./uploads/' + temp);
        res.redirect('/#/demo');
      });
    })
  }
})

app.post('/search', function(req, res){
  fsFile.find({filename: req.body.query + '.mp3'}).then(function(data){ //search db
    if(!data[0]) {
      console.log("file not in db");
      res.redirect("/#demo");
    } else {
      var writestream = fs.createWriteStream('./uploads/'+req.body.query+'.mp3'); //write to uploads folder
      var readstream = gfs.createReadStream({ //read from mongodb
        filename: req.body.query + '.mp3' //(handle multiples eventually by querying by id)
        //search by user, search by animation HERE
      });
      readstream.pipe(writestream);
      writestream.on('close', function () {
        console.log(req.body.query + ' written to uploads');
        res.redirect('/#/success');
      });
    }
  })
})



*/
