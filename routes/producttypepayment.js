module.exports = app => {
    const productTypePayments = require("../controllers/producttypepayment.js");
  
    var router = require("express").Router();
  
    // create ProductTypePayment
    router.post("/", productTypePayments.create);

    // Retrieve all ProductTypePayments
    router.get("/", productTypePayments.findAll);
  
    // Retrieve a single ProductTypePayment with id
    router.get("/:id", productTypePayments.findOne);
  
    // Update a ProductTypePayment with id
    router.put("/:id", productTypePayments.update);
  
    // Delete a ProductTypePayment with id
    router.delete("/:id", productTypePayments.delete);

    // Retrieve all ProductTypePayments By ProductType Id
    router.get("/byproducttype/:id", productTypePayments.findByProductTypeId);

    app.use('/api/producttypepayments', router);
};