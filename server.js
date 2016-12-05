var express = require('express');
var app = express();
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

mongoose.connect('mongodb://localhost/tracks');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);

app.use(bodyParser.json())
app.use(express.static(__dirname)); //Frontend connectivity
app.listen(8000);
console.log("running on 8000")

//--LISTENERS
app.post('/areyouready', upload, function(req, res){
  if(!req.files[0]){
    res.redirect('/#/demo')
  } else{
    var temp = req.files[0].originalname

    //filename to store in mongodb
    var writestream = gfs.createWriteStream({
        filename: temp
    });
    fs.createReadStream('./uploads/' + temp).pipe(writestream); //link this to upload file path
    writestream.on('close', function (file) {
      // do something with `file`
      console.log(file.filename + ' Written To DB');
    })

    fs.unlink('./uploads/' + temp)
    res.redirect('/#/demo')
  }

})

app.post('/search', function(req, res){
  //fs.unlink('./uploads/temp.mp3')

      //write content to folder
      var writestream = fs.createWriteStream('./uploads/'+req.body.query+'.mp3'); //name to write in upload folder

      //read from mongodb
      var readstream = gfs.createReadStream({
        filename: req.body.query + '.mp3'
      });

      readstream.pipe(writestream);
      writestream.on('close', function () {
        console.log(req.body.query+ ' written to uploads');
      });

  // res.setHeader("Accept-Ranges", "none")
  //res.redirect('/#/success')
  res.redirect('/#/success')
})