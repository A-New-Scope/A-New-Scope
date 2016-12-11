const multer = require('multer');
  
const storage = multer.diskStorage({
  destination: 'uploadTemp/', //-destination folder
  filename(req, file, cb) {
    cb(null, file.originalname); //-keep original filename + extension
  }
});

const upload = multer({ storage }).any();

module.exports = upload;