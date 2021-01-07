module.exports = app => {
    const products = require("../controllers/product.js");
  
    var router = require("express").Router();
  
    // create Product
    router.post("/", products.create);

    // Retrieve all Products
    router.get("/client/:page/:size", products.findAll);

    // Retrieve all Products with Pagination
    router.get("/:page/:size", products.findAndCountAll);
  
    // Retrieve a single Product with id
    router.get("/:id", products.findOneForClient);

    // Retrieve a single Product with child by id
    router.get("/one/detail/:id", products.findOne);
  
    // Update a Product with id
    router.put("/:id", products.update);
  
    // Delete a Product with id
    router.delete("/:id", products.delete);

    app.use('/api/products', router);
};