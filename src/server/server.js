let express = require('express');

let app = express();

let port = 3300; // TODO: add an || with process.env.PORT configuration and switch order with 3000 when complete

app.listen(port);
console.log('listening on port ', port);

// middleware
  /*  may need to change so that only specific directories are served static,
      since some Angular-related files may require a different routing method */
app.use(express.static('client'));

//routing behavior that we will want to replace with Angular ui-route
// insert any needed routing behavior here