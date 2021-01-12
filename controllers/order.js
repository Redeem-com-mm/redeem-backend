const db = require("../models");
const Product = db.products;
const Category = db.categories;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Redeem = db.redeems;
const OrderRedeems = db.orderredeems;
const Order = db.orders;
const SubCategory = db.subcategories;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');
const Op = Sequelize.Op;
const product_redeem_id = process.env.redeem_id;

//#region create Order
exports.create = async (req, res) => {
    try{
      let decoded = await Authentication.JwtVerify(req.headers.authorization);
      if (!decoded) throw {
              status: 401,
              message: "Provide Valid JWT Token"
      }

      if(!req.body.product_id || !req.body.category_id || !req.body.sub_category_id || !req.body.payment_type_id) throw {
          status: 400,
          message: "Some of required parameters are empty!"
      }

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);

      const product = await Product.findByPk(req.body.product_id, {
        include : {
          model : Category,
          where : {id : req.body.category_id},
          include : {
            model : SubCategory,
            where : {id : req.body.sub_category_id}
          }
        }
      });        

      const order = req.body;   
      
      if(order.udf){
        for(var i = 0; i < order.udf.length ; i++){
          switch(i){
            case 0 : 
              order.udf1 = order.udf[i].udf1;
              break;
            case 1 : 
              order.udf2 = order.udf[i].udf2;
              break;
            case 2 : 
              order.udf3 = order.udf[i].udf3;
              break;
            case 3 : 
              order.udf4 = order.udf[i].udf4;
              break;
            case 4 : 
              order.udf5 = order.udf[i].udf5;
              break;
            case 5 : 
              order.udf6 = order.udf[i].udf6;
              break;
            case 6 : 
              order.udf7 = order.udf[i].udf7;
              break;
            case 7 : 
              order.udf8 = order.udf[i].udf8;
              break;
            case 8 : 
              order.udf9 = order.udf[i].udf9;
              break;
            case 9 : 
              order.udf10 = order.udf[i].udf10;
              break;
            default:
              break;
          }
        }

        order.udf = null;
      }

      console.log("Order : " + order);

      var qty = 1;
      var redeem_ids = [];
      var merchant_status = false;

      if(product){
        if(!product.auto_pay){
          if(!req.body.consumer_no || !req.body.payment_slip) throw {
            status: 400,
            message: "Some of required parameters are empty!"
          }
        }
        else{
          //Need to call Payment   
        }

        var generatedId = uuidv4();
        order.id = uuidv4();
        order.order_no = generatedId.split('-')[4].toUpperCase();
        order.tran_date = Date.now();            
        order.updated_date = Date.now();
        order.user_id = decodedToken.user_id;
        order.updated_by = decodedToken.user_id;
        order.product_type_id = product.product_type_id;
        order.product_name = product.name;
        order.product_name_mm = product.name_mm;
        order.category_name = product.categories[0].name;
        order.sub_category_name = product.categories[0].subcategories[0].name;
        order.paid_price = product.categories[0].subcategories[0].sale_price;

        const result = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async transaction => {
          var option = {
            transaction
          };

          if(product.product_type_id === product_redeem_id){
            if(merchant_status){  
              const redeems = await Redeem.findAndCountAll({
                where : {
                  sub_category_id : req.body.sub_category_id, is_sold : false
                },
                limit : qty,
                transaction
              });
    
              if(req.body.quantity){
                qty = req.body.quantity;
              }
    
              if(qty > redeems.count){
                throw {
                  status: 400,
                  message: "Stock quantity is not enough to buy!"
                }
              }
              order.orderredeems = redeems.rows.map(r => {
                var redeem = {};
                redeem.id = uuidv4();
                redeem.redeem_id = r.id;
                return redeem;
              });            
  
              redeem_ids = redeems.rows.map(r => r.id);

              option = {
                include : OrderRedeems,
                transaction
              }

              await Redeem.update({is_sold : true}, {where : {id : {[Op.in] : redeem_ids}}, transaction})
              .then(num => {
                console.log('Updated sold true redeems count : ' + num)
              })
              .catch(err => {
                throw {
                  status: 500,
                  message: err.message || " Error updating redeem with ids=" + redeem_ids
                }
              });
            }
          }

          await Order.create(order, option)
          .then(data => {
              console.log("Created Data : " + data);
              res.send({
                  id: data.id,
                  message : "Order is submitted!"
              });
          })
          .catch(err => {
              throw {
                  status: 500,
                  message: err.message || "Some error occurred while submitting the Order."
              }
          }); 
        })
      }
      else{
        throw {
          status: 400,
          message: "Your order product is not found."
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

//#region Retrieve all Order For User from the database with Pagination.
exports.findAllForUser = async (req, res) => {  
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

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);

        var where = {user_id : decodedToken.user_id}

        if(req.query.tran_status){
          where.tran_status = req.query.tran_status;
        }

        let size = req.params.size;
        let page = req.params.page;

        page = Number(page) - 1;

        await Order.findAndCountAll({
          where : where,
          offset : page * size,
          limit : size,
          distinct : true, 
          // Add order conditions here....
          order: [
              ['updated_date', 'DESC']
          ],
          include :{
            model : Product,
            as : "Product"
          }
        })
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving orders by user."
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

//#region Retrieve all Orders For Admin with Pagination from the database.
exports.findAllForAdmin = async (req, res) => {  
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

      if(req.query.tran_status){
        where.tran_status = req.query.tran_status;
      }

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = await roles.findOne(decodedToken.userRole);

      if(currentRole != null && (currentRole.name === "admin")){
        await Order.findAndCountAll({
          where : where,
          offset : page * size,
          limit : size,
          distinct : true, 
          // Add order conditions here....
          order: [
              ['updated_date', 'DESC']
          ],
          include :{
            model : Product,
            as : "Product"
          }
        })
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving orders."
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

//#region  Find a single Order with an id For User
exports.findOneForUser = async (req, res) => {
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

      const order = await Order.findByPk(id,{
          where : {user_id : decodedToken.user_id},
          include :{
            model : Product,
            as : "Product"
          }
      });
      res.send(order);
    }
    catch(e){
      let status = e.status ? e.status : 500
      res.status(status).json({
          error: e.message || "Some error occurred while retrieving product."
      });
    }  
  };
//#endregion

//#region  Find a single Order by an id For Admin
exports.findOneForAdmin = async (req, res) => {
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
      const order = await Order.findByPk(id, {
        include :{
          model : Product,
          as : "Product"
        }
      });
      res.send(order);
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
        error: e.message || "Some error occurred while retrieving order."
    });
  }  
};
//#endregion

//#region  Update a Order For Admin by the id in the request
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
        const order = req.body;
        order.updated_date = Date.now();        
        order.updated_by = decodedToken.user_id;

        const result = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async transaction => {
          const rowOrder = await Order.findByPk(id, {transaction});

          if(rowOrder.product_type_id === product_redeem_id && order.tran_status && order.tran_status === "Approved"){
            var qty = 0;

            if(order.quantity){
              qty = order.quantity;
            }
            else{
              qty = rowOrder.quantity;
            }

            const redeems = await Redeem.findAndCountAll({
              where : {
                sub_category_id : rowOrder.sub_category_id, is_sold : false
              },
              limit : qty,
              transaction
            });
  
            if(qty > redeems.count){
              throw {
                status: 400,
                message: "Stock quantity is not enough to buy!"
              }
            }
            const orderredeems = redeems.rows.map(r => {
              var redeem = {};
              redeem.id = uuidv4();
              redeem.redeem_id = r.id;
              redeem.order_id = rowOrder.id;
              return redeem;
            });            

            redeem_ids = redeems.rows.map(r => r.id);

            await Redeem.update({is_sold : true}, {where : {id : {[Op.in] : redeem_ids}}, transaction})
            .then(num => {
              console.log('Updated sold true redeems count : ' + num)
            })
            .catch(err => {
              throw {
                status: 500,
                message: err.message || " Error updating redeem with ids=" + redeem_ids
              }
            });

            await OrderRedeems.bulkCreate(orderredeems, {transaction})
            .then(data => {
                console.log("Created Order Redeems Data : " + data);                
            })
            .catch(err => {
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Order Redeems."
                }
            });
          }

          await Order.update(order, {
            where : {id : id},
            transaction
          })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Order was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
              });
            }
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || " Error updating Order with id=" + id
            }
          }); 
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

//#region  Delete a Order with the specified id in the request
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
      
      var where = {
        id : id
      };

      if(currentRole != null && currentRole.name === "user"){
        where.tran_status = "Pending";
        where.user_id = decodedToken.user_id;
      }
  
      if(currentRole != null && (currentRole.name === "admin" || currentRole.name === "user")){
        await Order.destroy({where : where})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Order was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Order was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete order with id=" +  id
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