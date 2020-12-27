const dbConfig = require("../config/db.config.js");
const fs = require('fs');
const rdsCa = fs.readFileSync(__dirname + '/redeem.crt');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: false,  
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
      ca: [rdsCa]
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.roles = require("./role.js")(sequelize, Sequelize);
db.otps = require("./otp.js")(sequelize, Sequelize);
db.producttypes = require("./producttype.js")(sequelize, Sequelize);
db.products = require("./product.js")(sequelize, Sequelize);
db.categories = require("./category.js")(sequelize, Sequelize);
db.subcategories = require("./subcategory.js")(sequelize, Sequelize);
db.redeems = require("./redeem.js")(sequelize, Sequelize);
db.fields = require("./field.js")(sequelize, Sequelize);
db.categoryfields = require("./categoryfield.js")(sequelize, Sequelize);
db.paymenttypes = require("./paymenttype.js")(sequelize, Sequelize);
db.producttypepayments = require("./producttypepayment.js")(sequelize, Sequelize);
db.sliders = require("./slider.js")(sequelize, Sequelize);

module.exports = db;