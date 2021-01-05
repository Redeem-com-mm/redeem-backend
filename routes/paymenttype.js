module.exports = app => {
    const paymenttypes = require("../controllers/paymenttype.js");
  
    var router = require("express").Router();
  
    // create PaymentType
    router.post("/", paymenttypes.create);

    // Retrieve all Payments Types
    router.get("/", paymenttypes.findAll);

    // Retrieve all Payments Types By Client
    router.get("/byclient", paymenttypes.findAllByClient);
  
    // Retrieve a single Payment Type with id
    router.get("/:id", paymenttypes.findOne);
  
    // Update a Payment Type with id
    router.put("/:id", paymenttypes.update);
  
    // Delete a Payment Type with id
    router.delete("/:id", paymenttypes.delete);

    app.use('/api/paymenttypes', router);
};