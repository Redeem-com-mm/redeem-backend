const db = require("../models");
const Category = db.categories;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region create Category
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.name || !req.body.product_id) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const category = req.body;
            category.id = uuidv4();
            category.created_date = Date.now();            
            category.updated_date = Date.now();
            category.created_by = decodedToken.user_id;
            category.updated_by = decodedToken.user_id;

            await Category.create(category)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "Category is created!"
                });
            })
            .catch(err => {
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Category."
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

//#region Retrieve all Category from the database.
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
          await Category.findAll()
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving categories."
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

//#region  Find a single Category with an id
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
        const cateogry = await Category.findByPk(id);
        res.send(cateogry);
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
          error: e.message || "Some error occurred while retrieving category."
      });
    }  
  };
//#endregion

//#region  Update a Category by the id in the request
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
        const category = req.body;
        category.updated_date = Date.now();        
        category.updated_by = decodedToken.user_id;
      
        await Category.update(category, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Category was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Error updating Category with id=" + id
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

//#region  Delete a Category with the specified id in the request
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
        await Category.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Category was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Category was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete category with id=" +  id
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

//#region Retrieve all Category from the database By Product.
exports.findByProductId = async (req, res) => {  
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
        await Category.findAll({where : {product_id : id}})
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving categories by product."
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