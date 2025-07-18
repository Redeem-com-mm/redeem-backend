const db = require("../models");
const User = db.users;
const Otp = db.otps;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region Create New User
exports.create = async (req, res) => {
  try{
    // Validate request
    if (!req.body.phone_no || !req.body.name || !req.body.address 
      || !req.body.city || !req.body.township || (!req.body.password && !req.body.social_id )) throw {
        status: 400,
        message: "Some of required parameters are empty!"
    }

    //Check User
    const oldUser = await User.findAll({where : {phone_no : req.body.phone_no}});

    if(oldUser != null && oldUser.length > 0) throw {
      status: 400,
      message: "You Phone No is already registered!"
    };

    // Create a User
    const user = req.body;

    if(!req.body.role_id){
      const role = await roles.findOneByName('user');
      const roleObj = JSON.parse(role);
  
      if(roleObj === null || roleObj.length <= 0) throw {
        status: 400,
        message: "Role Not Found!"
      };
  
      user.role_id = roleObj[0].id;
    }
    else{
      user.role_id = req.body.role_id
    }
    
    user.id = uuidv4();
    user.is_active = true;
    const encryptPassword = Authentication.CryptoEncrypt(req.body.password);
    user.password = encryptPassword;    
    user.created_date = Date.now();
    user.updated_date = Date.now();

    // Save user in the database
    await User.create(user)
      .then(data => {
        res.send({
          message : "Register is successfully completed."
        });
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || "Some error occurred while creating the User."
        }
      });
  }
  catch(e){
    let status = e.status ? e.status : 500
    res.status(status).json({
        error: e.message
    })
  }
};
//#endregion

//#region Retrieve all Users from the database.
exports.findAll = async (req, res) => {  
  try{
      let decoded = await Authentication.JwtVerify(req.headers.authorization);
      if (!decoded) throw {
            status: 401,
            message: "Provide Valid JWT Token"
      }

      if(!req.params.page || !req.params.size) throw {
        status: 400,
        message: "Required Fields are not found"
      }

      let size = req.params.size;
      let page = req.params.page;

      page = Number(page) - 1;

      var where = {};

      if(req.query.role_id){
        where.role_id = req.query.role_id;
      }

      if(req.query.is_active){
        where.is_active = req.query.is_active;
      }

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = await roles.findOne(decodedToken.userRole);

      if(currentRole != null && currentRole.name === "admin" ){
        await User.findAndCountAll({where : where,
          offset : page * size,
          limit : size,
          distinct : true, 
          order: [
          ['updated_date', 'DESC']
        ]})
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving users."
          }
        });
      }
      else{
        throw {
          status: 401,
          message: "Unauthorize Resource"
        }
      }      
    }
    catch(e){
      let status = e.status ? e.status : 500
      res.status(status).json({
          error: e.message
      })
    }
};
//#endregion

//#region  Find a single User with an id
exports.findOne = async (req, res) => {
  try{
    let decoded = await Authentication.JwtVerify(req.headers.authorization);
    if (!decoded) throw {
          status: 401,
          message: "Provide Valid JWT Token"
    }

    if(!req.params.id) throw {
      status: 400,
      message: "Param Id Not Found"
    }

    const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
    const currentRole = await roles.findOne(decodedToken.userRole);
    const id = req.params.id;

    if(currentRole != null && (( id === decodedToken.user_id && currentRole.name === "user") 
    || currentRole.name === "admin")){      
      const user = await User.findByPk(id ,{attributes : [
        'id',
        'name',
        'email',
        'photo_url',
        'phone_no',
        'social_id',
        'role_id',
        'address',
        'city',
        'township',
        'is_active',
        'login_count',
        'lastlogin_date',
        'created_date',
        'updated_date'
      ]});
      res.send(user);
    }
    else{
      throw {
        status: 401,
        message: "Unauthorize Resource"
      }
    }    
  }
  catch(e){
    let status = e.status ? e.status : 500
    res.status(status).json({
        error: e.message || "Some error occurred while retrieving user."
    });
  }  
};
//#endregion

//#region  Update a User by the id in the request
exports.update = async (req, res) => {  
  try{
    let decoded = await Authentication.JwtVerify(req.headers.authorization);
    if (!decoded) throw {
          status: 401,
          message: "Provide Valid JWT Token"
    }

    if(!req.params.id) throw {
      status: 400,
      message: "Param Id Not Found"
    }

    const id = req.params.id;
    const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
    const currentRole = await roles.findOne(decodedToken.userRole);

    if(req.body.is_active && currentRole.name !== "admin") throw {
      status: 400,
      message: `Cannot update User with id=${id}!`
    }

    if(currentRole != null && (( id === decodedToken.user_id && currentRole.name === "user") 
    || currentRole.name === "admin")){ 
      const user = req.body;
      user.updated_date = Date.now();
    
      await User.update(user, {
        where : {id : id}
      })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || " Error updating User with id=" + id
        }
      });
    }
    else{
      throw {
        status: 401,
        message: "Unauthorize Resource"
      }
    }
  }
  catch(e){
    let status = e.status ? e.status : 500
    res.status(status).json({
        error: e.message
    })
  }
};
//#endregion

//#region Forgot Password
exports.forgotpassword = async (req, res) => {  
  try{
    if(req.body.phone_no && !req.body.otp && !req.body.password) throw {
      status: 400,
      message: "Some of required parameters are empty!"
    }

    const phone_no = req.body.phone_no;
    const reqOtp = req.body.otp;
    
    if(req.body.is_active) throw {
      status: 400,
      message: `Cannot update User with phone number=${phone_no}!`
    }

    const decryptedOtp = Authentication.CryptoDecrypt(reqOtp);

    if(!decryptedOtp) throw { 
      status : 400,
      message: "OTP is not valid!" 
    };

    const otpObj = await Otp.findByPk(phone_no);

    if(otpObj !== null){
        let createdTime = new Date(otpObj.created_at);
        let currentTime = new Date();
        let seconds = Math.floor((currentTime.getTime() - createdTime.getTime()) / 1000);
        if (seconds > validitySeconds) throw { 
            status : 400,
            message: "OTP is expired!" 
        };

        if (otpObj.otp !== decryptedOtp) throw { 
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

    const user = req.body;
    user.updated_date = Date.now();
    const encryptPassword = Authentication.CryptoEncrypt(req.body.password);
    user.password = encryptPassword;  
    
    await User.update(user, {
      where : {
        phone_no : phone_no, 
        is_active : true
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with phone number=${phone_no}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      throw {
        status: 500,
        message: err.message || " Error updating User with phone number=" + phone_no
      }
    });
  }
  catch(e){
    let status = e.status ? e.status : 500
    res.status(status).json({
        error: e.message
    })
  }
};
//#endregion

//#region  Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  try{
    let decoded = await Authentication.JwtVerify(req.headers.authorization);
    if (!decoded) throw {
          status: 401,
          message: "Provide Valid JWT Token"
    } 
    if(!req.params.id) throw {
      status: 400,
      message: "Param Id Not Found"
    }

    const id = req.params.id;
    const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
    const currentRole = await roles.findOne(decodedToken.userRole);

    if(currentRole != null && currentRole.name === "admin" ){
      await User.destroy({where : {id : id}})
      .then(num => {
        if(num === 1){
          res.send({
              message : "User was deleted successfully!"
          });
        }
        else{
            res.send({
                message : `Cannot delete with id= ${id}. May be User was not found!`
            })
        }
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || " Could not delete User with id=" +  id
        }
      })
    }
    else{
      throw {
        status: 401,
        message: "Unauthorize Resource"
      }
    }
  }
  catch(e){
    let status = e.status ? e.status : 500
    res.status(status).json({
        error: e.message
    })
  }
};
//#endregion

//#region Retrieve User Status from the database.
exports.getUserStatus = async (req, res) => {  
  try{
      if(!req.body.phone_no) throw {
        status: 400,
        message: "Phone No is required!"
      }
      const phoneNo = req.body.phone_no;

      const decryptedPhoneNo = Authentication.CryptoDecrypt(phoneNo);

      if(!decryptedPhoneNo){
          throw {
              status: 401,
              message: "Unauthorize Resource"
          }
      }

      await User.findAll({where : {phone_no : decryptedPhoneNo}})
        .then(data => {
          if(data != null && data.length > 0){
            res.send({
              firstTimeLogin : false,
              is_active : data[0].is_active
            });
          }
          else{
            res.send({
              firstTimeLogin : true
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while checking users."
          }
        });     
    }
    catch(e){
      let status = e.status ? e.status : 500
      res.status(status).json({
          error: e.message
      })
    }
};
//#endregion

//#region Find a single Role with userId
exports.findRoleByUser = async (userId) => {
  var user = null;

  try{
    user = await User.findByPk(userId);
  }
  catch(err){
      console.log(err);
  }

  return user;
};
//#endregion

// Find all published Users
exports.findAllPublished = (req, res) => {
  
};