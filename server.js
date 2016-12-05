var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var Grid = require('gridfs-stream');
var bodyParser = require('body-parser');


//////////////////////////MULTER//////////////////////////// --UPLOAD FILES YO

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: 'uploads/', //-destination folder
  filename: function(req, file, cb){
    cb(null, file.originalname) //-keep original filename + extension
  }
})
var upload = multer({
  storage: storage //write to storage then pass storage to gridfs?
}).any()

////////////////////////////////////////////////////////////


var app = express();
mongoose.connect('mongodb://localhost/demo');


///////////////////////////GRIDFS////////////////////////// --HANDLE MONGO DB

// var conn = mongoose.connection;
// Grid.mongo = mongoose.mongo;

// //change this to query by _id instead of filename to handle multiple files with same name?
// conn.once('open', function () { //call on post request
//     var gfs = Grid(conn.db);

//     //filename to store in mongodb
//     var writestream = gfs.createWriteStream({
//         filename: 'demoName.txt' //make customizable from input form
//     });

//     fs.createReadStream('demoFile.txt').pipe(writestream); //link this to upload file path

//     writestream.on('close', function (file) {
//       // do something with `file`
//       console.log(file.filename + 'Written To DB');

//       //write content to file system
//       var fs_write_stream = fs.createWriteStream('temp.txt');

//       //read from mongodb
//       var readstream = gfs.createReadStream({
//         filename: 'demoName.txt'
//       });
//       readstream.pipe(fs_write_stream);
//       fs_write_stream.on('close', function () {
//         console.log('file has been written fully!');
//       });
//     });
// });

///////////////////////////////////////////////////////////


app.use(express.static(__dirname)); //Frontend connectivity
app.listen(8000);
console.log("running on 8000")


//--LISTENERS
var temp;

app.post('/areyouready', upload, function(req, res){
  console.log(req.files[0].originalname)
  temp = req.files[0].originalname
  //res.send(req.files[0].originalname) //USE FIELDNAME FOR CUSTOM NAMING
  res.redirect('/#/demo')
})

app.get('/areyouready', function(req, res){
  res.send(temp)
})