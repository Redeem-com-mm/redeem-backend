const db = require("../models");
const ProductType = db.producttypes;
const { v4: uuidv4 } = require('uuid');
const roles = require("./role.js");
const Authentication = require('../services/authentication.js');

//#region create ProductType
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.name) throw {
            status: 400,
            message: "Name is required!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const type = req.body;
            type.id = uuidv4();

            await ProductType.create(type)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "Product Type is created!"
                });
            })
            .catch(err => {
                console.log("Error : " +  err);
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Product Type."
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

//#region Retrieve all Product Type from the database.
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
          await ProductType.findAll()
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            console.log("Error : " +  err);
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving product type."
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

//#region  Find a single Product Type with an id
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
        const type = await ProductType.findByPk(id);
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
          error: e.message || "Some error occurred while retrieving product type."
      });
    }  
  };
//#endregion

//#region  Update a Product type by the id in the request
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
        const type = req.body;
      
        await ProductType.update(type, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Product Type was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Product Type with id=${id}. Maybe Product Type was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
            console.log("Error : " +  err);
            throw {
                status: 500,
                message: err.message || " Error updating Product Type with id=" + id
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

//#region  Delete a Product Type with the specified id in the request
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
        await ProductType.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Product Type was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Product Type was not found!`
              })
          }
        })
        .catch(err => {
            console.log("Error : " +  err);
            throw {
                status: 500,
                message: err.message || " Could not delete product type with id=" +  id
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