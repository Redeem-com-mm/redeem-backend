module.exports = app => {
    const pages = require("../controllers/page.js");
  
    var router = require("express").Router();
  
    // create Page
    router.post("/", pages.create);

    // Retrieve all Pages For Client
    router.get("/byclient", pages.findAllByClient);

    // Retrieve all Menu For Client
    router.get("/menu", pages.findAllMenuByClient);

    // Retrieve a single Page with permalink
    router.get("/menu/:permalink", pages.findOnePage);    

    // Retrieve all Pages For Admin
    router.get("/:page/:size", pages.findAll);
  
    // Retrieve a single Page with id
    router.get("/:id", pages.findOne);
  
    // Update a Page with id
    router.put("/:id", pages.update);
  
    // Delete a Page with id
    router.delete("/:id", pages.delete);

    app.use('/api/pages', router);
};