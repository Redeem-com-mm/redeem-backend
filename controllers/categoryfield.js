const db = require("../models");
const Field = db.fields;
const CategoryField = db.categoryfields;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region create CategoryField
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.field_id || !req.body.category_id) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const categoryField = req.body;
            categoryField.id = uuidv4();
            categoryField.created_date = Date.now();            
            categoryField.updated_date = Date.now();
            categoryField.created_by = decodedToken.user_id;
            categoryField.updated_by = decodedToken.user_id;

            await CategoryField.create(categoryField)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "CategoryField is created!"
                });
            })
            .catch(err => {
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the CategoryField."
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

//#region Retrieve all CategoryField from the database.
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
          await CategoryField.findAll({
            include: [{
              model: Field,
              as : "Field" // specifies how we want to be able to access our joined rows on the returned data
            }]
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving categoryfields."
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

//#region  Find a single CategoryField with an id
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
        const categoryfield = await CategoryField.findByPk(id);
        res.send(categoryfield);
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
          error: e.message || "Some error occurred while retrieving categoryfield."
      });
    }  
  };
//#endregion

//#region  Update a CategoryField by the id in the request
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
        const categoryfield = req.body;
        categoryfield.updated_date = Date.now();        
        categoryfield.updated_by = decodedToken.user_id;
      
        await CategoryField.update(categoryfield, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "CategoryField was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update CategoryField with id=${id}. Maybe CategoryField was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Error updating CategoryField with id=" + id
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

//#region  Delete a CategoryField with the specified id in the request
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
        await CategoryField.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "CategoryField was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be CategoryField was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete CategoryField with id=" +  id
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

//#region Retrieve all CategoryField from the database By Category.
exports.findByCategoryId = async (req, res) => {  
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
        await CategoryField.findAll({where : {category_id : id},
          include: [{
            model: Field,
            as : "Field" // specifies how we want to be able to access our joined rows on the returned data
          }]
        })
        .then(data => {
          res.send(data.map(d=>d.Field));
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving categoryfields by category."
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