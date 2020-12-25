const db = require("../models");
const User = db.users;
const Authentication = require('../services/authentication.js');

//#region Normal Login
exports.login = async (req, res) => {
  try{
      // Validate request
      if (!req.body.phone_no || !req.body.password) throw {
          status: 400,
          message: "Content can not be empty!"
      }
      const phone_no = req.body.phone_no;
      const password = req.body.password;
      var condition = { phone_no: phone_no, password : password };
      const user = await User.findAll({ where: condition });

      if(user === null || user.length <= 0)throw {
          status: 400,
          message: "User Not Found Or Password is incorrect, Please register!"
      }

      if(user[0].is_active){
        const token = await Authentication.JwtSign({ user_id: user[0].id, userRole: user[0].role_id });
        res.cookie('t', token, {expire: new Date() + 9999});
        res.send({
            token : token,
            user: {
              name : user[0].name,
              id : user[0].id,
              role: user[0].role_id
            }
            
        });
      }
      else{
        throw{
          status : 400,
          message : "User is not active!"
        }
      }        
    }
    catch(e){
      let status = e.status ? e.status : 500
      res.status(status).json({
          error: e.message || "Some error occurred while login."
      })
    }  
  };
//#endregion

//#region Social Login
exports.socialLogin = async (req, res) => {
  try{
    if(!req.params.social_id) throw{
      status : 400,
      message : "Social Id is required!"
    }
    const user = await User.findAll({ where: {social_id : req.params.social_id} });

    if(user != null && user.length > 0){
      if(user[0].is_active){
        const token = await Authentication.JwtSign({ user_id: user[0].id, userRole: user[0].role_id });
        res.send({
          firstTimeLogin : false,
          name : user[0].name,
          id : user[0].id,
          token : token
        });
      }
      else{
        throw{
          status : 400,
          message : "User is not active!"
        }
      }
    }
    else{
      res.send({
        firstTimeLogin : true
      });
    }
  }
  catch(e){
    let status = e.status ? e.status : 500
    res.status(status).json({
        error: e.message || "Some error occurred while social login."
    })
  }    
};

exports.signout = (req, res ) => {
  res.clearCookie("t")
  res.json({message: 'Signout successful'});
}
//#endregion