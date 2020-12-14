module.exports = app => {
    const categoryField = require("../controllers/categoryfield.js");
  
    var router = require("express").Router();
  
    // create CategoryField
    router.post("/", categoryField.create);

    // Retrieve all CategoryFields
    router.get("/", categoryField.findAll);
  
    // Retrieve a single CategoryField with id
    router.get("/:id", categoryField.findOne);
  
    // Update a CategoryField with id
    router.put("/:id", categoryField.update);
  
    // Delete a CategoryField with id
    router.delete("/:id", categoryField.delete);

    // Retrieve all CategoryFields By SubCategory Id
    router.get("/bycategory/:id", categoryField.findByCategoryId);

    app.use('/api/categoryfields', router);
};