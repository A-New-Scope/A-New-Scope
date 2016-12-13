// Multer is a node.js middleware for handling multipart/form-data,
// which is primarily used for uploading files. 

const multer = require('multer');
  
const storage = multer.diskStorage({
  destination: 'uploadTemp/', //-destination folder
  filename(req, file, cb) {
    cb(null, file.originalname); //-keep original filename + extension
  }
});

const upload = multer({ storage }).any();	// sets storage to line 6 and chaining .any()
											// allows us to accept the uploads
module.exports = upload;