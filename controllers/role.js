const db = require("../models");
const Role = db.roles;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
const Authentication = require('../services/authentication.js');

// Create and Save a new Role
exports.create = async (req, res) => { 
  try{
    let decoded = await Authentication.JwtVerify(req.headers.authorization);
    if (!decoded) throw {
      status: 401,
      message: "Provide Valid JWT Token"
    }

    // Validate request
    if (!req.body.name) throw {
      status: 401,
      message: "name can not be empty!"
    }
  
    const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
    const currentRole = await roles.findOne(decodedToken.userRole);
    if(currentRole != null && currentRole.name === "admin" ){
        // Create a Role
        const role = {
          id: uuidv4(),
          name: req.body.name
        };

        // Save role in the database
        await Role.create(role)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || "Some error occurred while creating the Role."
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

// Retrieve all Roles from the database.
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
      await Role.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || "Some error occurred while retrieving roles."
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

// Find a single Role with an name
exports.findOneByName = async (name) => {
    var condition = name ? { name: name} : null;
    var role = [];
    
    try{
        const data = await Role.findAll({ where: condition });
        role = JSON.stringify(data);
    }
    catch(err){
        console.log(err);
    }

    return role;
};

// Find a single Role with an name
exports.findOne = async (id) => {
  var role = {};  
  try{
      const data = await Role.findByPk(id);
      role = data;
  }
  catch(err){
      console.log(err);
  }
  return role;
};

// Update a Role by the id in the request
exports.update = (req, res) => {
    
};

// Delete a Role with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Role.destroy({where : {id : id}})
        .then(num => {
            if(num === 1){
                res.send({
                    message : "Role was deleted successfully!"
                });
            }
            else{
                res.send({
                    message : `Cannot delete with id= ${id}. May be Role was not found!`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Could not delete Role with id=" +  id
            })
        })
};

// Delete all Roles from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Roles
exports.findAllPublished = (req, res) => {
  
};