module.exports = app => {
    const redeems = require("../controllers/redeem.js");
  
    var router = require("express").Router();
  
    // create Redeem
    router.post("/", redeems.create);

    // Retrieve all Redeems
    router.get("/", redeems.findAll);
  
    // Retrieve a single Redeem with id
    router.get("/:id", redeems.findOne);
  
    // Update a Redeem with id
    router.put("/:id", redeems.update);
  
    // Delete a Redeem with id
    router.delete("/:id", redeems.delete);

    // Retrieve all Redeems By SubCategory Id
    router.get("/bysubcategory/:id", redeems.findBySubCategoryId);

    // Retrieve all Redeems count By SubCategory Id
    router.get("/getcount/:id", redeems.getCountBySubCategoryId);

    app.use('/api/redeems', router);
};