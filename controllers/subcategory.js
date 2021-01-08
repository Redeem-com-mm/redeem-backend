const db = require("../models");
const SubCategory = db.subcategories;
const Category = db.categories;
const Product = db.products;
const sequelize = db.Sequelize;
const Op = sequelize.Op;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');
const product = require("../models/product");

//#region create SubCategory
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.name || !req.body.category_id || !req.body.price) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const subCategory = req.body;
            subCategory.id = uuidv4();
            subCategory.created_date = Date.now();            
            subCategory.updated_date = Date.now();
            subCategory.created_by = decodedToken.user_id;
            subCategory.updated_by = decodedToken.user_id;

            if(!req.body.sale_price){
              subCategory.sale_price = subCategory.price;
            }

            await SubCategory.create(subCategory)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "SubCategory is created!"
                });
            })
            .catch(err => {
              console.log(err);
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the SubCategory."
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

//#region Retrieve all SubCategory from the database.
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
          await SubCategory.findAll()
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving subcategories."
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

//#region  Find a single SubCategory with an id
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
        const subcateogry = await SubCategory.findByPk(id);
        res.send(subcateogry);
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
          error: e.message || "Some error occurred while retrieving subcategory."
      });
    }  
  };
//#endregion

//#region  Update a SubCategory by the id in the request
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
        const subcategory = req.body;
        subcategory.updated_date = Date.now();        
        subcategory.updated_by = decodedToken.user_id;
      
        await SubCategory.update(subcategory, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "SubCategory was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update SubCategory with id=${id}. Maybe SubCategory was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Error updating SubCategory with id=" + id
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

//#region  Delete a SubCategory with the specified id in the request
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
        await SubCategory.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "SubCategory was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be SubCategory was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete SubCategory with id=" +  id
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

//#region Retrieve all SubCategory from the database By Category.
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
        await SubCategory.findAll({where : {category_id : id}})
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving subcategories by category."
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

//#region Retrieve all SubCategory from the database By Promotion.
exports.findByPromotion = async (req, res) => {  
  try{
      if(!req.params.page || !req.params.size) throw {
        status: 400,
        message: "Required Fields are not found"
      }
      let size = req.params.size;
      let page = req.params.page;

      page = Number(page) - 1;

      await SubCategory.findAndCountAll({
        offset : page * size,
        limit : size,
        distinct : true, 
        // Add order conditions here....
        order: [
            ['updated_date', 'DESC']
        ],
        include : [
          {
            model: Category,
            as : "Category",
            include : [
              {
                model : Product,
                as : "Product",
                where : {is_active : true}
              }
            ]
          }
        ],
        where : {price : { [Op.gt] : sequelize.col('sale_price')}}
      })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || "Some error occurred while retrieving subcategories by promotion."
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

//#region  Delete Multiple SubCategory with the specified ids in the request
exports.deleteSubCategories = async (ids, transaction) => {
  try{
      await SubCategory.destroy({where : {id:{[Op.in]: ids}}, transaction})
      .then(num => {
        return num;
      })
      .catch(err => {
        throw {
          status: 500,
          message: e.message || " Could not delete subcategories with ids=" +  ids
        }
      })
  }
  catch(e){
    throw {
      status: 500,
      message: err.message || " Could not delete subcategories with ids =" +  ids
    }
  }
};
//#endregion