module.exports = app => {
    const users = require("../controllers/user.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", users.create);

    // Retrieve check Users status
    router.post("/checkstatus", users.getUserStatus);

    // Forgot Password
    router.post("/forgot", users.forgotpassword);
  
    // Retrieve all Users
    router.get("/:page/:size", users.findAll);
  
    // Retrieve a single User with id
    router.get("/:id", users.findOne);
  
    // Update a User with id
    router.put("/:id", users.update);
  
    // Delete a User with id
    router.delete("/:id", users.delete);
  
    app.use('/api/users', router);
  };