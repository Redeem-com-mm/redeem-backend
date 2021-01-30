const db = require("../models");
const Notification = db.notifications;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region Retrieve all Notifications from the database.
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

        var where = {}

        if(req.query.noti_owner){
          where.noti_owner = req.query.noti_owner;
        }
        
        await Notification.findAndCountAll({
          where : where,
          offset : page * size,
          limit : size,
          distinct : true, 
          // Add order conditions here....
          order: [
              ['order_date', 'DESC']
          ]})
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving notifications."
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

//#region  Update a Notification by the id in the request
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
    var where = {
      id : id
    };

    if(currentRole.name === "user"){
      where.noti_owner = decodedToken.user_id;
    }

    var notification = {};
    notification.is_read = true;
    await Notification.update(notification, {
      where : where
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Notification was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Notification with id=${id}. Maybe Notification was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      throw {
        status: 500,
        message: err.message || " Error updating Notification with id=" + id
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

//#region  Delete a Notification with the specified id in the request
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
        await Notification.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Notification was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Notification was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete notification with id=" +  id
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