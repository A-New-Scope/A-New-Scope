var express = require('express');
//var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();

//mongoose.connect('mongodb://localhost/insta');

app.use(express.static(__dirname)); //Frontend connectivity
app.use(bodyParser.json()); //Handle client


app.listen(8000);
console.log("running on 8000")