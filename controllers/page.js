const db = require("../models");
const Page = db.pages;
const { v4: uuidv4 } = require('uuid');
const roles = require("../controllers/role.js");
const Authentication = require('../services/authentication.js');

//#region create Page
exports.create = async (req, res) => {
    try{
        let decoded = await Authentication.JwtVerify(req.headers.authorization);
        if (!decoded) throw {
                status: 401,
                message: "Provide Valid JWT Token"
        }

        if(!req.body.title_mm || !req.body.title || !req.body.menu || !req.body.menu_mm 
          || !req.body.permalink || !req.body.body || !req.body.body_mm) throw {
            status: 400,
            message: "Some of required parameters are empty!"
        }

        const decodedToken = await Authentication.JwtDecoded(req.headers.authorization);
        const currentRole = await roles.findOne(decodedToken.userRole);

        if(currentRole != null && currentRole.name === "admin" ){
            const page = req.body;
            page.id = uuidv4();
            page.created_date = Date.now();            
            page.updated_date = Date.now();
            page.created_by = decodedToken.user_id;
            page.updated_by = decodedToken.user_id;

            await Page.create(page)
            .then(data => {
                console.log("Created Data : " + data);
                res.send({
                    message : "Page is created!",
                    data : data
                });
            })
            .catch(err => {
                throw {
                    status: 500,
                    message: err.message || "Some error occurred while creating the Page."
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

//#region Retrieve all Page from the database.
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
          await Page.findAndCountAll({
            where : {is_active : true},
            offset : page * size,
            limit : size,
            distinct : true, 
            // Add order conditions here....
            order: [
                ['updated_date', 'DESC']
            ]})
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            throw {
              status: 500,
              message: err.message || "Some error occurred while retrieving pages."
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

//#region Retrieve all Pages For Client from the database.
exports.findAllByClient = async (req, res) => {  
  try{
      await Page.findAll({where : {is_active : true}})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || "Some error occurred while retrieving pages."
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

//#region Retrieve all Menu For Client from the database.
exports.findAllMenuByClient = async (req, res) => {  
  try{
      await Page.findAll({
        where : {is_active : true},
        attributes : [
          "id",
          "menu",
          "menu_mm",
          "permalink"
        ],
        // Add order conditions here....
        order: [
            ['weight', 'ASC']
        ]
      })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        throw {
          status: 500,
          message: err.message || "Some error occurred while retrieving menu."
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

//#region  Find a single Page with an Permalink
exports.findOnePage = async (req, res) => {
  try{  
    if(!req.params.permalink) throw {
      status: 400,
      message: "Param Not Found"
    }
    const permalink = req.params.permalink;
    
    const pages = await Page.findAll({where : {permalink : permalink}});
    const page = pages != null && pages.length > 0 ? pages[0] : {};
    
    res.send(page);
  }
  catch(e){
    let status = e.status ? e.status : 500
    res.status(status).json({
        error: e.message || "Some error occurred while retrieving page."
    });
  }  
};
//#endregion

//#region  Find a single Page with an id
exports.findOne = async (req, res) => {
    try{  
      if(!req.params.id) throw {
        status: 400,
        message: "Param Id Not Found"
      }
      const id = req.params.id;
      
      const page = await Page.findByPk(id);
      res.send(page);
    }
    catch(e){
      let status = e.status ? e.status : 500
      res.status(status).json({
          error: e.message || "Some error occurred while retrieving page."
      });
    }  
  };
//#endregion

//#region  Update a Page by the id in the request
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
        const page = req.body;
        page.updated_date = Date.now();        
        page.updated_by = decodedToken.user_id;
      
        await Page.update(page, {
          where : {id : id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Page was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Page with id=${id}. Maybe Page was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Error updating Page with id=" + id
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

//#region  Delete a Page with the specified id in the request
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
        await Page.destroy({where : {id : id}})
        .then(num => {
          if(num === 1){
            res.send({
                message : "Page was deleted successfully!"
            });
          }
          else{
              res.send({
                  message : `Cannot delete with id= ${id}. May be Page was not found!`
              })
          }
        })
        .catch(err => {
          throw {
            status: 500,
            message: err.message || " Could not delete page with id=" +  id
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