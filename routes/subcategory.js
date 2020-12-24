module.exports = app => {
    const subcategories = require("../controllers/subcategory.js");
  
    var router = require("express").Router();
  
    // create SubCategory
    router.post("/", subcategories.create);

    // Retrieve all SubCategories
    router.get("/", subcategories.findAll);
  
    // Retrieve a single SubCategory with id
    router.get("/:id", subcategories.findOne);
  
    // Update a SubCategory with id
    router.put("/:id", subcategories.update);
  
    // Delete a SubCategory with id
    router.delete("/:id", subcategories.delete);

    // Retrieve all SubCategories By Category Id
    router.get("/bycategory/:id", subcategories.findByCategoryId);

    // Retrieve all SubCategories By Promotion
    router.get("/all/promotion", subcategories.findByPromotion);

    app.use('/api/subcategories', router);
};