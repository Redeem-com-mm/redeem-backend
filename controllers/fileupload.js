const fileServices = require('../services/fileUpload');
const Authentication = require('../services/authentication.js');

exports.upload = async(req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        const singleUpload = fileServices.fields([{ name: 'file', maxCount: 1 }])
        
        await singleUpload(req, res, function (err) {
            console.log(req);
            console.log(req.files)
            
            if(!req.body.id || !req.body.file_category || !req.files.file){
                res.status(400).json({
                    message: "Some of required parameters are empty!"
                })
            }
            else{
                if (err) {
                    console.log("Image upload Error", err)
                    if (err.message === "Invalid File Type") {
                        res.status(400).json({
                            message: err.message
                        })
                    }
                    else {
                        res.status(500).json({
                            message: err.code
                        })
                    }
                }
                else{    
                    var fileExt = req.files.file[0].mimetype === "image/jpeg"? ".jpg" : ".png"
                    
                    res.status(200).json({
                        message: "File uploaded successfully.",
                        file_name : req.body.id + fileExt
                    })
                }  
            }          
        });
    }
    catch(e){
        let status = e.status ? e.status : 500
        res.status(status).json({
            error: e.message
        })
    }
}