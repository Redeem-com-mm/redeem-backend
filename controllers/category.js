const db = require("../models");
const Category = db.categories;
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const SubCategory = db.subcategories;
const Redeem = db.redeems;
const Field = db.fields;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');
const field = require("../models/field");
const category = require("../models/category");
const { json } = require("body-parser");

//#region create Category with child table
exports.createwithchild = async (req, res) => {
  try{
      let decoded = await Authentication.JwtVerify(req.headers.authorization);
      if (!decoded) throw {
              status: 401,
              message: "Provide Valid JWT Token"
      }

      if(!req.body.product_id && !req.body.category) throw {
          status: 400,
          message: "Some of required parameters are empty!"
      }

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = await roles.findOne(decodedToken.userRole);

      if(currentRole != null && currentRole.name === "admin" ){
          const category = req.body.category;
          const product_id = req.body.product_id;
          var responseData = {};
          
          const result = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async transaction => {
            category.id = uuidv4();
            category.product_id = product_id;
            category.created_date = Date.now();            
            category.updated_date = Date.now();
            category.created_by = decodedToken.user_id;
            category.updated_by = decodedToken.user_id;
            category.subcategories = category.subcategories != null && category.subcategories.length > 0 ? category.subcategories.map(s=>{
              var subCategory = {};
              subCategory.id =  uuidv4();
              subCategory.name = s.name;
              subCategory.price = s.price;
              subCategory.sale_price = s.sale_price;
              subCategory.created_date = Date.now();            
              subCategory.updated_date = Date.now();
              subCategory.created_by = decodedToken.user_id;
              subCategory.updated_by = decodedToken.user_id;
              /* subCategory.redeems = s.redeems.map(r=> {
                var redeem = {};

                redeem.id =  uuidv4();
                redeem.code = r.code;
                redeem.created_date = Date.now();            
                redeem.updated_date = Date.now();
                redeem.created_by = decodedToken.user_id;
                redeem.updated_by = decodedToken.user_id;

                return redeem;
              }); */

              return subCategory;
            }) : null;
            category.fields = category.fields != null && category.fields.length > 0 ? category.fields.map(f=>{
              var field = {};
              field.id =  uuidv4();
              field.name = f.label;
              field.name_mm = f.label_mm;
              field.created_date = Date.now();            
              field.updated_date = Date.now();
              field.created_by = decodedToken.user_id;
              field.updated_by = decodedToken.user_id;

              return field;
            }) : null;

            /* var option = category.subcategories != null ? {
              include : [{
                model: SubCategory,
                include : {
                  model : Redeem
                } 
              },
              {
                model : Field
              }],
              transaction
            } : null; */

            var option = null;

            if(category.subcategories != null && category.fields != null){
              option = {
                include : [{
                  model: SubCategory
                },
                {
                  model : Field
                }],
                transaction 
              };
            }
            else if(category.subcategories != null){
              option = {
                include : SubCategory,
                transaction
              }              
            }
            else if(category.fields != null){
              option = {
                include : Field,
                transaction
              }  
            }

            await Category.create(category, option).then(data => {
              console.log("Created Data : " + data);
              responseData = data;
            })
            .catch(async err => {   
                console.log(err); 
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Category."
                }
            });
        });     
        
        console.log("Result : " + result);

        res.send({
          message : "Category is created!",
          data : responseData
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
exports.delete = (req, res) => {
    try{
      let decoded = Authentication.JwtVerify(req.headers.authorization);
      if (!decoded) throw {
            status: 401,
            message: "Provide Valid JWT Token"
      } 
      if(!req.params.id) throw {
        status: 400,
        message: "Param Id Not Found"
      }
  
      const id = req.params.id;
      const decodedToken = Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = roles.findOne(decodedToken.userRole);
  
      if(currentRole != null && currentRole.name === "admin" ){
        const result = sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async transaction => {
          const category = Category.findByPk(id, {
            include : [
              {
                model : SubCategory,
                include : {
                  model : Redeem
                }
              },
              {
                model : Field
              }
            ],
            attributes : [
              'id'
            ]
          });

          if(category != null){
            if(category.fields != null && category.fields.length > 0){
              Field.destroy({where:{id:{$in:category.fields.map(function(f){ return f.id})}},
                transaction
              })
              .then(num => {
                console.log("Field Deleted Records : " + num);
              })
              .catch(err => {
                throw {
                  status: 500,
                  message: err.message || " Could not delete category with id=" +  id
                }
              })
            }

            if(category.subcategories !=  null && category.subcategories.length > 0){
              if(category.subcategories.redeems != null && category.subcategories.redeems.length > 0){
                category.subcategories.forEach(async subCategory => {
                  if(subCategory.redeems != null && subCategory.redeems.length > 0){
                    Redeem.destroy({where:{id:{$in:subCategory.redeems.map(function(r){ return r.id})}},
                      transaction
                    })
                    .then(async num => {
                      console.log("Redeem Deleted Records : " + num);
                      SubCategory.destroy({where:{id: subCategory.id},
                        transaction
                      })
                      .then(num => {
                        console.log("SubCategory Deleted Records : " + num);
                      })
                      .catch(err => {
                        throw {
                          status: 500,
                          message: err.message || " Could not delete category with id=" +  id
                        }
                      })
                    })
                    .catch(err => {
                      throw {
                        status: 500,
                        message: err.message || " Could not delete category with id=" +  id
                      }
                    })
                  }
                  else{
                    SubCategory.destroy({where:{id: subCategory.id},
                      transaction
                    })
                    .then(num => {
                      console.log("SubCategory Deleted Records : " + num);
                    })
                    .catch(err => {
                      throw {
                        status: 500,
                        message: err.message || " Could not delete category with id=" +  id
                      }
                    })
                  }
                });
              }              
            }           

            Category.destroy({where : {id : id}})
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
              status: 400,
              message: "No record found to delete with id=" +  id
            }
          }
        }).catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete category with id=" +  id
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
        await Category.findAll({where : {product_id : id},
          include : [{
            model : SubCategory,
            include : {
              model : Redeem
            }
          },
          {
            model : Field
          }
        ]
        })
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