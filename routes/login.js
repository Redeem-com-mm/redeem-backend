module.exports = app => {
    const logins = require("../controllers/login.js");
  
    var router = require("express").Router();  

    router.post("/login", logins.login);
    router.get("/sociallogin/:social_id", logins.socialLogin);

    app.use('/api', router);
  };