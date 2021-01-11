const db = require("../models");
const PaymentType = db.paymenttypes;
const { v4: uuidv4 } = require('uuid');
const roles = require("./role.js");
const Authentication = require('../services/authentication.js');

//#region create PaymentType
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.name || !req.body.merchant_name || !req.body.merchant_code || !req.body.type || !req.body.logo_url) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const paymentType = req.body;
            paymentType.id = uuidv4();
            paymentType.created_date = Date.now();            
            paymentType.updated_date = Date.now();
            paymentType.created_by = decodedToken.user_id;
            paymentType.updated_by = decodedToken.user_id;

            await PaymentType.create(paymentType)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "Payment Type is created!"
                });
            })
            .catch(err => {
                console.log("Error : " +  err);
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Payment Type."
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
}
//#endregion

//#region Retrieve all Payment Type from the database.
exports.findAll = async (req, res) => {  
  try{
      let decoded = await Authentication.JwtVerify(req.headers.authorization);
      if (!decoded) throw {
            status: 401,
            message: "Provide Valid JWT Token"
      }

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = await roles.findOne(decodedToken.userRole);

      if(currentRole != null && currentRole.name === "admin" ){
        await PaymentType.findAll()
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          console.log("Error : " +  err);
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving payment type."
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

//#region Retrieve all Payment Type For Client from the database.
exports.findAllByClient = async (req, res) => {  
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
              status: 401,
              message: "Provide Valid JWT Token"
        }
        
        await PaymentType.findAll({where : {is_active : true},
          attributes : [
            'id',
            'name',
            'merchant_name',
            'merchant_code',
            'qr_url',
            'logo_url',
            'type'
          ]})
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          console.log("Error : " +  err);
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving payment type."
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

//#region  Find a single Payment Type with an id
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
  
      if(currentRole != null && currentRole.name === "admin"){      
        const type = await PaymentType.findByPk(id);
        res.send(type);
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
          error: e.message || "Some error occurred while retrieving payment type."
      });
    }  
  };
//#endregion

//#region  Update a Payment type by the id in the request
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
    
      if(currentRole != null && currentRole.name === "admin"){ 
        const paymentType = req.body;
        paymentType.updated_date = Date.now();        
        paymentType.updated_by = decodedToken.user_id;
      
        await PaymentType.update(paymentType, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Payment Type was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Payment Type with id=${id}. Maybe Payment Type was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
            console.log("Error : " +  err);
            throw {
                status: 500,
                message: err.message || " Error updating Payment Type with id=" + id
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

//#region  Delete a Payment Type with the specified id in the request
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
        await PaymentType.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Payment Type was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Payment Type was not found!`
              })
          }
        })
        .catch(err => {
            console.log("Error : " +  err);
            throw {
                status: 500,
                message: err.message || " Could not delete Payment type with id=" +  id
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
          error: e.message,
      })
    }
  };
//#endregion