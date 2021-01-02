module.exports = app => {
    const fileUploads = require("../controllers/fileupload.js");
  
    var router = require("express").Router();
  
    // File Upload
    router.post("/", fileUploads.upload);

    app.use('/api/fileupload', router);
};