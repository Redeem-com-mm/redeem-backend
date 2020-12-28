module.exports = app => {
    const logins = require("../controllers/login.js");
  
    var router = require("express").Router();  

    router.post("/login", logins.login);
    router.post("/sociallogin", logins.socialLogin);
    router.get("/logout", logins.signout);

    app.use('/api', router);
  };