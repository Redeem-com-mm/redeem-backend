module.exports = app => {
    const otps = require("../controllers/otp.js");
  
    var router = require("express").Router();
  
    // sendOTP
    router.post("/sendOTP", otps.sendOtp);

    // verifyOTP
    router.post("/verifyOTP", otps.verifyOtp);
  
    app.use('/api', router);
};