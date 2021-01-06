const fileServices = require('../services/fileUpload');
const Authentication = require('../services/authentication.js');
require('dotenv').config();
const basePath = process.env.base_path;
const maxSize  = process.env.max_size;

exports.upload = async(req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        const singleUpload = fileServices.single('file')
        
        await singleUpload(req, res, function (err) {
            //console.log(req);
            console.log(req.file)
            
            if(!req.body.id || !req.body.file_category){
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
                    else if(err.code === "LIMIT_FILE_SIZE"){
                        res.status(500).json({
                            message: "Your file size is large. Accepted file size is " + maxSize + " bytes."
                        })
                    }
                    else {
                        res.status(500).json({
                            message: err.code
                        })
                    }
                }
                else
                {    
                    var fileExt = req.file.mimetype === "image/jpeg"? ".jpg" : ".png"
                    //var filePath = req.files.file[0].path;
                    //console.log("file path : " + filePath);

                    res.status(200).json({
                        message: "File uploaded successfully.",
                        file_name : "/" + basePath + "/" + req.body.file_category + "/" + req.body.id + fileExt
                        //file_name : ""+ filePath
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