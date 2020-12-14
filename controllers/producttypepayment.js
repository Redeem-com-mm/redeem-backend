const db = require("../models");
const PaymentType = db.paymenttypes;
const ProductTypePayment = db.producttypepayments;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region create ProductTypePayment
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.payment_type_id || !req.body.product_type_id) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const productTypePayment = req.body;
            productTypePayment.id = uuidv4();
            productTypePayment.created_date = Date.now();            
            productTypePayment.updated_date = Date.now();
            productTypePayment.created_by = decodedToken.user_id;
            productTypePayment.updated_by = decodedToken.user_id;

            await ProductTypePayment.create(productTypePayment)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "ProductTypePayment is created!"
                });
            })
            .catch(err => {
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the ProductTypePayment."
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

//#region Retrieve all ProductTypePayment from the database.
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
          await ProductTypePayment.findAll({
            include: [{
              model: PaymentType,
              as : "PaymentType" // specifies how we want to be able to access our joined rows on the returned data
            }]
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving producttypepayments."
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

//#region  Find a single ProductTypePayment with an id
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
        const productTypePayment = await ProductTypePayment.findByPk(id);
        res.send(productTypePayment);
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
          error: e.message || "Some error occurred while retrieving producttypepayment."
      });
    }  
  };
//#endregion

//#region  Update a ProductTypePayment by the id in the request
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
        const productTypePayment = req.body;
        productTypePayment.updated_date = Date.now();        
        productTypePayment.updated_by = decodedToken.user_id;
      
        await ProductTypePayment.update(productTypePayment, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "ProductTypePayment was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update ProductTypePayment with id=${id}. Maybe ProductTypePayment was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Error updating ProductTypePayment with id=" + id
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

//#region  Delete a ProductTypePayment with the specified id in the request
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
        await ProductTypePayment.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "ProductTypePayment was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be ProductTypePayment was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete ProductTypePayment with id=" +  id
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

//#region Retrieve all ProductTypePayment from the database By ProductType.
exports.findByProductTypeId = async (req, res) => {  
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
        await ProductTypePayment.findAll({where : {product_type_id : id},
          include: [{
            model: PaymentType,
            as : "PaymentType" // specifies how we want to be able to access our joined rows on the returned data
          }]
        })
        .then(data => {
          res.send(data.map(d=>d.PaymentType));
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving producttypepayments by product type."
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