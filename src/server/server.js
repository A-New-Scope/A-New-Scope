/* eslint-disable no-console, angular/log, angular/interval-service */

//TO DO
//FLASH SUCCESS/FAILURE MESSAGES ON EDIT AND LOGIN/SIGNUP

/////////////////////////DEPENDENCIES///////////////////////
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash'); //not used...yet
const del = require('del');
const path = require('path');
const app = express();

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

require('./config/router.js')(app, express);	// router.js file exports a function requiring these two arguments
require('./config/uploadFile.js')(app, express, gfs, fsFile);  // uploadFile.js exports a function with 4 params

const port = process.env.PORT || 3300;
app.listen(port);

console.log('running on ', port);
///////////////////////////////////////////////////////////////

//-CLEAR IMPORTS PERIODICALLY
setInterval(() => {
  del(['./src/client/imports/*']).then(data => {
    console.log('imports cleared', data);
  }).catch(err => {
    throw err;
  });
}, 300000); //clear imports every 5 minutes