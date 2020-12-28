const db = require("../models");
const User = db.users;
const Role = db.roles;
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
      const user = await User.findAll({ 
        include: [{
          model: Role,
          as : "Role" // specifies how we want to be able to access our joined rows on the returned data
        }],
        where: condition 
      });

      if(user === null || user.length <= 0)throw {
          status: 400,
          message: "User Not Found Or Password is incorrect, Please register!"
      }

      if(user[0].is_active){
        var loginUser = {};
        loginUser.login_count = user[0].login_count + 1;
        loginUser.lastlogin_date = Date.now();
    
        await User.update(loginUser, {
          where : {id : user[0].id}
        })

        const token = await Authentication.JwtSign({ user_id: user[0].id, userRole: user[0].role_id });
        res.cookie('t', token, {expire: new Date() + 9999});
        res.send({
            token : token,
            user: {
              name : user[0].name,
              id : user[0].id,
              email : user[0].email,
              role: user[0].Role.name
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
    if(!req.body.social_id) throw{
      status : 400,
      message : "Social Id is required!"
    }
    const user = await User.findAll({ 
      include: [{
        model: Role,
        as : "Role" // specifies how we want to be able to access our joined rows on the returned data
      }],
      where: {social_id : req.body.social_id} 
    });

    if(user != null && user.length > 0){
      if(user[0].is_active){
        var loginUser = {};
        loginUser.login_count = user[0].login_count + 1;
        loginUser.lastlogin_date = Date.now();
    
        await User.update(loginUser, {
          where : {id : user[0].id}
        })

        const token = await Authentication.JwtSign({ user_id: user[0].id, userRole: user[0].role_id });
        res.cookie('t', token, {expire: new Date() + 9999});
        res.send({
          firstTimeLogin : false,           
          token : token,
          user: {
            name : user[0].name,
            id : user[0].id,
            email : user[0].email,
            role: user[0].Role.name
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
  res.clearCookie("t");
  res.json({message: 'Signout successful'});
}
//#endregion