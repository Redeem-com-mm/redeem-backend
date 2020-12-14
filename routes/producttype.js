module.exports = app => {
    const producttypes = require("../controllers/producttype.js");
  
    var router = require("express").Router();
  
    // create ProductType
    router.post("/", producttypes.create);

    // Retrieve all Products Types
    router.get("/", producttypes.findAll);
  
    // Retrieve a single Product Type with id
    router.get("/:id", producttypes.findOne);
  
    // Update a Product Type with id
    router.put("/:id", producttypes.update);
  
    // Delete a Product Type with id
    router.delete("/:id", producttypes.delete);

    app.use('/api/producttypes', router);
};