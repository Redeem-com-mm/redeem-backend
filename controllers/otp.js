const db = require("../models");
const Otp = db.otps;
var validitySeconds = 180;

//#region  sendOTP
exports.sendOtp = async (req, res) => {
    try{
        if(!req.body.phone_no) throw {
            status: 400,
            message: "Phone No is required!"
        }

        var generateOtp = Math.floor(Math.random() * Math.floor(999999));
        generateOtp = generateOtp.toString().padStart(6, 0);
        let timestamp = (new Date()).toISOString();
        const phone_no = req.body.phone_no;
        var otp = {
            phone_no : phone_no,
            otp : generateOtp,
            created_at : timestamp
        }

        const otpObj = await Otp.findByPk(phone_no);

        if(otpObj != null){
            Otp.update(otp, {where : {phone_no : phone_no}});
        }
        else{
            Otp.create(otp);
        }

        res.send({
            message : "OTP is generated!"
        });
    }
    catch(e){
        let status = e.status ? e.status : 500
        res.status(status).json({
            error: e.message
        })
    }    
}
//#endregion

//#region VerifyOTP
exports.verifyOtp = async (req, res) => {
    try{
        if(!req.body.otp && !req.body.phone_no){
            throw {
                status: 400,
                message: "Content can not be empty!"
            }
        }

        const phone_no = req.body.phone_no;
        const reqOtp = req.body.otp;

        const otpObj = await Otp.findByPk(phone_no);

        if(otpObj !== null){
            let createdTime = new Date(otpObj.created_at);
            let currentTime = new Date();
            let seconds = Math.floor((currentTime.getTime() - createdTime.getTime()) / 1000);
            if (seconds > validitySeconds) throw { 
                status : 400,
                message: "OTP is expired!" 
            };

            if (otpObj.otp !== reqOtp) throw { 
                status : 400,
                message: "OTP is not valid!" 
            };
        }
        else{
            throw { 
                status : 400,
                message: "Phone No is not found!" 
            };
        }
        
        res.send({
            message : "OTP is valid!"
        });
    }
    catch(e){
        let status = e.status ? e.status : 500
        res.status(status).json({
            error: e.message
        })
    }
}
//#endregion