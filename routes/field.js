module.exports = app => {
    const fields = require("../controllers/field.js");
  
    var router = require("express").Router();
  
    // create Field
    router.post("/", fields.create);

    // Retrieve all Fields
    router.get("/", fields.findAll);
  
    // Retrieve a single Field with id
    router.get("/:id", fields.findOne);

    // Retrieve all Fields By Category Id
    router.get("/bycategory/:id", fields.findByCategoryId);
  
    // Update a Field with id
    router.put("/:id", fields.update);
  
    // Delete a Field with id
    router.delete("/:id", fields.delete);

    app.use('/api/fields', router);
};