module.exports = app => {
    const categories = require("../controllers/category.js");
  
    var router = require("express").Router();
  
    // create Category
    router.post("/", categories.create);

    // Retrieve all Categories
    router.get("/", categories.findAll);
  
    // Retrieve a single Category with id
    router.get("/:id", categories.findOne);
  
    // Update a Category with id
    router.put("/:id", categories.update);
  
    // Delete a Category with id
    router.delete("/:id", categories.delete);

    // Retrieve all Categories By Product Id
    router.get("/byproduct/:id", categories.findByProductId);

    app.use('/api/categories', router);
};