module.exports = app => {
    const sliders = require("../controllers/slider.js");
  
    var router = require("express").Router();
  
    // create Slider
    router.post("/", sliders.create);

    // Retrieve all Sliders
    router.get("/:page/:size", sliders.findAll);

    // Retrieve all Sliders
    router.get("/client", sliders.findAllByClient);
  
    // Retrieve a single Slider with id
    router.get("/:id", sliders.findOne);
  
    // Update a Slider with id
    router.put("/:id", sliders.update);
  
    // Delete a Category with id
    router.delete("/:id", sliders.delete);

    app.use('/api/sliders', router);
};