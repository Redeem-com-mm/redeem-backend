module.exports = app => {
    const sections = require("../controllers/section.js");
  
    var router = require("express").Router();
  
    // create Section
    router.post("/", sections.create);

    // Retrieve all Sections
    router.get("/getlist", sections.findAllList);

    // Retrieve all Sections
    router.get("/:page/:size", sections.findAll);

    // Retrieve all Sections
    router.get("/byclient", sections.findAllByClient);
  
    // Retrieve a single Section with id
    router.get("/:id", sections.findOne);
  
    // Update a Section with id
    router.put("/:id", sections.update);
  
    // Delete a Section with id
    router.delete("/:id", sections.delete);

    app.use('/api/sections', router);
};