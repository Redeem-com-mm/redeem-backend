const order = require("../models/order.js");

module.exports = app => {
    const orders = require("../controllers/order.js");
  
    var router = require("express").Router();
  
    // create Order
    router.post("/", orders.create);    

    // Retrieve all Orders with Pagination By User
    router.get("/user/:page/:size", orders.findAllForUser);

    // Retrieve all Orders with Pagination By Admin
    router.get("/:page/:size", orders.findAllForAdmin);
  
    // Retrieve a single Order For User with id
    router.get("/user/client/one/:id", orders.findOneForUser);

    // Retrieve a single Order For Admin by id
    router.get("/:id", orders.findOneForAdmin);
  
    // Update a Order with id
    router.put("/:id", orders.update);
  
    // Delete a Order with id
    router.delete("/:id", orders.delete);

    app.use('/api/orders', router);
};