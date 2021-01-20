const db = require("../models");
const Section = db.sections;
const { v4: uuidv4 } = require('uuid');
const roles = require("./role.js");
const Authentication = require('../services/authentication.js');

//#region create Section
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.name || !req.body.name_mm) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const section = req.body;
            section.id = uuidv4();
            section.created_date = Date.now();            
            section.updated_date = Date.now();
            section.created_by = decodedToken.user_id;
            section.updated_by = decodedToken.user_id;

            await Section.create(section)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    data : data,
                    message : "Section is created!"
                });
            })
            .catch(err => {
                console.log("Error : " +  err);
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Section."
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

//#region Retrieve all Name and Id for Admin
exports.findAllList = async (req, res) => {  
  try{
      let decoded = await Authentication.JwtVerify(req.headers.authorization);
      if (!decoded) throw {
            status: 401,
            message: "Provide Valid JWT Token"
      }

      const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
      const currentRole = await roles.findOne(decodedToken.userRole);

      if(currentRole != null && currentRole.name === "admin" ){
        await Section.findAll({
          attributes : [
            "id",
            "name",
            "name_mm"
          ],
          // Add order conditions here....
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
            message: err.message || "Some error occurred while retrieving section list."
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

//#region Retrieve all Sections from the database.
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

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);
  
        if(currentRole != null && currentRole.name === "admin" ){
          await Section.findAndCountAll({
            offset : page * size,
            limit : size,
            distinct : true, 
            // Add order conditions here....
            order: [
                ['updated_date', 'DESC']
            ]
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            console.log("Error : " +  err);
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving section."
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

//#region Retrieve all Sections By Client from the database.
exports.findAllByClient = async (req, res) => {  
  try{
      await Section.findAll({
        // Add order conditions here....
        order: [
            ['updated_date', 'DESC']
        ],
        attributes : [
          'id',
          'name',
          'name_mm',
          'photo_url',
          'description'
        ]
      })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log("Error : " +  err);
        throw {
          status: 500,
          message: err.message || "Some error occurred while retrieving section."
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

//#region  Find a single Section with an id
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
        const section = await Section.findByPk(id);
        res.send(section);
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
          error: e.message || "Some error occurred while retrieving section."
      });
    }  
  };
//#endregion

//#region  Update a Section by the id in the request
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
        const section = req.body;
        section.updated_date = Date.now();
        section.updated_by = decodedToken.user_id;
      
        await Section.update(section, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Section was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Section with id=${id}. Maybe Section was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
            console.log("Error : " +  err);
            throw {
                status: 500,
                message: err.message || " Error updating Section with id=" + id
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

//#region  Delete a Section with the specified id in the request
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
        await Section.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Section was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Section was not found!`
              })
          }
        })
        .catch(err => {
            console.log("Error : " +  err);
            throw {
                status: 500,
                message: err.message || " Could not delete Section with id=" +  id
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