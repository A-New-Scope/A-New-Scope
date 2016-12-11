const passportFile = require('./passportFile.js');

module.exports = function(app, express) {

  app.post('/login', passportFile.passport.authenticate('login'), (req, res) => {
    res.end();
  });

  app.post('/signup', passportFile.passport.authenticate('signup'), (req, res) => {
    res.end();
  });

  app.get('/auth', passportFile.isLoggedIn, (req, res) => {
    res.end();
  });

/**
 * Uses built-in Passport functionality to log out.
 */
  app.get('/logout', (req, res) => {
    req.logout();
    res.end();
  });

/////////////////////////////////////////////////

/**
 * Returns the username of the currently logged in session
 * on the passport object.
 */

  app.get('/getCurrentUsername', passportFile.isLoggedIn, (req, res) => {
    console.log('res of /getCurrentUsername is ', res);
    console.log('req.session.passport.user is ', req.session.passport.user);
    res.send(req.session.passport.user);
  });
};