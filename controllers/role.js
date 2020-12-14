const db = require("../models");
const Role = db.roles;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');

// Create and Save a new Role
exports.create = (req, res) => { 
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Role
  const role = {
    id: uuidv4(),
    name: req.body.name
  };

  // Save role in the database
  Role.create(role)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Role."
      });
    });
};

// Retrieve all Roles from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    //var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  
    Role.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving roles."
        });
      });
};

// Find a single Role with an name
exports.findOneByName = async (name) => {
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
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