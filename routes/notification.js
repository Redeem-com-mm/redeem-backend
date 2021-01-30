module.exports = app => {
    const notifications = require("../controllers/notification.js");
  
    var router = require("express").Router();
  
    // Retrieve all Notifications
    router.get("/:page/:size", notifications.findAll);
  
    // Delete a Notification with id
    router.delete("/:id", notifications.delete);

    // Update a Notification with id
    router.put("/:id", notifications.update);

    app.use('/api/notifications', router);
};