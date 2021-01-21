const db = require("../models");
const Product = db.products;
const Category = db.categories;
const Sequelize = db.Sequelize;
const Redeem = db.redeems;
const Field = db.fields;
const SubCategory = db.subcategories;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region create Product
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.name || !req.body.name_mm || !req.body.description
            || !req.body.description_mm || !req.body.weight
            || !req.body.category_label || !req.body.category_label_mm
            || !req.body.sub_category_label || !req.body.sub_category_label_mm
            || !req.body.photo_url || !req.body.product_type_id) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const product = req.body;
            product.id = uuidv4();
            product.created_date = Date.now();            
            product.updated_date = Date.now();
            product.created_by = decodedToken.user_id;
            product.updated_by = decodedToken.user_id;

            await Product.create(product)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    id: data.id,
                    product_type_id:data.product_type_id,
                    message : "Product is created!"
                });
            })
            .catch(err => {
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Product."
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

//#region Retrieve all Product Title for Client
exports.findAllTitle = async (req, res) => {  
  try{
      await Product.findAll({
        where : {is_active : true},
        attributes : [
          "id",
          "product_type_id",
          "section_id",
          "name",
          "name_mm"
        ],
        order: [
            ['name', 'ASC']
        ]
      })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || "Some error occurred while retrieving products title."
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

//#region Retrieve all Product For Client from the database with Pagination.
exports.findAll = async (req, res) => {  
    try{
        if(!req.params.page || !req.params.size) throw {
          status: 400,
          message: "Required Fields are not found"
        }

        let size = req.params.size;
        let page = req.params.page;

        page = Number(page) - 1;

        console.log( "Product Type Id : "+ req.query.product_type_id);

        var where = {is_active : true};

        if(req.query.product_type_id){
          where.product_type_id = req.query.product_type_id;
        }

        if(req.query.section_id){
          where.section_id = req.query.section_id;
        }

        await Product.findAndCountAll({
          where : where,
          offset : page * size,
          limit : size,
          distinct : true, 
          // Add order conditions here....
          order: [
              ['updated_date', 'DESC']
          ],
          include : {
            model : Category,
            include : [
              {
                model : SubCategory
              },
              {
                model : Field
              }
            ]
          }
        })
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving products."
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

//#region Retrieve all Product with Pagination from the database.
exports.findAndCountAll = async (req, res) => {  
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

      if(req.query.product_type_id){
        where.product_type_id = req.query.product_type_id;
      }

      if(req.query.section_id){
        where.section_id = req.query.section_id;
      }     

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = await roles.findOne(decodedToken.userRole);

      if(currentRole != null && (currentRole.name === "admin")){
        await Product.findAndCountAll({
          where : where,
          offset : page * size,
          limit : size,
          distinct : true, 
          // Add order conditions here....
          order: [
              ['updated_date', 'DESC']
          ],
          include : {
            model : Category,
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
            ]
          }
        })
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving products."
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

//#region  Find a single Product with an id For Client
exports.findOneForClient = async (req, res) => {
    try{  
      if(!req.params.id) throw {
        status: 400,
        message: "Param Id Not Found"
      }

      const id = req.params.id;

      const product = await Product.findByPk(id,{
        include : {
          model : Category,
          include : [
            {
              model : SubCategory
            },
            {
              model : Field
            }
          ]
        }
      });
      res.send(product);
    }
    catch(e){
      let status = e.status ? e.status : 500
      res.status(status).json({
          error: e.message || "Some error occurred while retrieving product."
      });
    }  
  };
//#endregion

//#region  Find a single Product with child by an id For Admin
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

    if(currentRole != null && (currentRole.name === "admin")){      
      const product = await Product.findByPk(id);
      res.send(product);
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
        error: e.message || "Some error occurred while retrieving product."
    });
  }  
};
//#endregion

//#region  Update a Product by the id in the request
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
        const product = req.body;
        product.updated_date = Date.now();        
        product.updated_by = decodedToken.user_id;
      
        await Product.update(product, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Product was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Error updating Product with id=" + id
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

//#region  Delete a Product with the specified id in the request
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
        await Product.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Product was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Product was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete product with id=" +  id
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