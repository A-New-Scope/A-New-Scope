var express = require('express');
var mongoose = require('mongoose'); // mongoose
var bodyParser = require('body-parser');

var app = express();

mongoose.connect('mongodb://localhost/demo'); //create or use demo db

app.use(express.static(__dirname)); //Frontend connectivity
app.use(bodyParser.json()); //Handle client


app.listen(8000);
console.log("running on 8000")


//--MONGOOSE schema
var Demo = mongoose.model('Demo', new mongoose.Schema({
    song_url: {type: String}
  })
)

//--listeners


app.post('/demoRoute', function(req, res){ //post

  //temp
  var tempDemo = new Demo({
    song_url: req.body.song_url
  })

  //find and insert
  Demo.find({song_url: req.body.song_url}, function(err, data){
    if(err){
      throw err
    }
    if(!data.length){ //if not found
      tempDemo.save(function(err){ //save to db
        if(err){
          throw err
        }
      })
    }
  })
})

app.get('/demoRoute', function(req, res){ //get

  Demo.find({}, function(err, data){ //find all
    if(err){
      throw err
    }

    res.send(data) //send response to client
  })
});