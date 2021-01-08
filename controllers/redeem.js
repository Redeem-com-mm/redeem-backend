const db = require("../models");
const Redeem = db.redeems;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region create Redeems With SubCategory
exports.createWithSubCategory = async (req, res) => {
  try{
      let decoded = await Authentication.JwtVerify(req.headers.authorization);
      if (!decoded) throw {
              status: 401,
              message: "Provide Valid JWT Token"
      }

      if(!req.body.redeems || !req.body.sub_category_id) throw {
          status: 400,
          message: "Some of required parameters are empty!"
      }

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = await roles.findOne(decodedToken.userRole);

      if(currentRole != null && currentRole.name === "admin" ){
          var redeems = req.body.redeems;

          redeems = redeems.map(r => {
            var redeem = r;
            redeem.id = uuidv4();   
            redeem.code = Authentication.CryptoEncrypt(r.code);         
            redeem.created_date = Date.now();            
            redeem.updated_date = Date.now();
            redeem.created_by = decodedToken.user_id;
            redeem.updated_by = decodedToken.user_id;
            redeem.sub_category_id = req.body.sub_category_id;

            return redeem;
          });

          console.log("Redeems : " + redeems);

          await Redeem.bulkCreate(redeems)
          .then(data => {
              console.log("Created Data : " + data);  
              res.send({
                message : "Redeems are created!",
                data : data
              });                
          })
          .catch(err => {
              throw {
                  status: 500,
                  message: err.message || "Some error occurred while creating the Redeem."
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

//#region create Redeem
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.name || !req.body.sub_category_id || !req.body.code) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const redeem = req.body;
            redeem.id = uuidv4();
            redeem.created_date = Date.now();            
            redeem.updated_date = Date.now();
            redeem.created_by = decodedToken.user_id;
            redeem.updated_by = decodedToken.user_id;
            redeem.code = Authentication.CryptoEncrypt(redeem.code);

            await Redeem.create(redeem)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "Redeem is created!"
                });
            })
            .catch(err => {
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Redeem."
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

//#region Retrieve all Redeem from the database.
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
          await Redeem.findAll({
            order: [
              ['updated_date', 'DESC']
            ]})
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving redeems."
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

//#region  Find a single Redeem with an id
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
        const redeem = await Redeem.findByPk(id);
        res.send(redeem);
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
          error: e.message || "Some error occurred while retrieving redeem."
      });
    }  
  };
//#endregion

//#region  Update a Redeem by the id in the request
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
        const redeem = req.body;
        redeem.updated_date = Date.now();        
        redeem.updated_by = decodedToken.user_id;
        if(redeem.code){
          redeem.code = Authentication.CryptoEncrypt(redeem.code);
        }
      
        await Redeem.update(redeem, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Redeem was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Redeem with id=${id}. Maybe Redeem was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Error updating Redeem with id=" + id
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

//#region  Delete a Redeem with the specified id in the request
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
        await Redeem.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Redeem was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Redeem was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete Redeem with id=" +  id
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

//#region Retrieve all Redeem from the database By SubCategory.
exports.findBySubCategoryId = async (req, res) => {  
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
        await Redeem.findAll({where : {sub_category_id : id},
          order: [
            ['updated_date', 'DESC']
          ]})
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving Redeems by SubCategory."
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

//#region Retrieve all Redeem Count from the database By SubCategory.
exports.getCountBySubCategoryId = async (req, res) => {  
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
        await Redeem.count({where : {
          sub_category_id : id, 
          is_sold : false}
        })
        .then(data => {
          res.send({
            count : data
          });
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || "Some error occurred while retrieving Redeems count by SubCategory."
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

//#region  Delete Multiple Redeem with the specified ids in the request
exports.deleteRedeems = async (ids, transaction) => {
  try{
      await Redeem.destroy({where : {id:{[Op.in]: ids}}, transaction})
      .then(num => {
        return num;
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || " Could not delete redeems with ids=" +  ids
        }
      })
  }
  catch(e){
    throw {
      status: 500,
      message: e.message || " Could not delete redeems with ids =" +  ids
    }
  }
};
//#endregion