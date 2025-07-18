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
db.orders = require("./order.js")(sequelize, Sequelize);
db.orderredeems = require("./orderredeems.js")(sequelize, Sequelize);
db.sections = require("./section.js")(sequelize, Sequelize);
db.pages = require("./page.js")(sequelize, Sequelize);
db.notiusers = require("./notiuser.js")(sequelize, Sequelize);
db.notifications = require("./notification.js")(sequelize, Sequelize);

db.orders.hasMany(db.orderredeems, {foreignKey: 'order_id'});
db.orders.hasMany(db.notifications, {foreignKey: 'order_id'});
db.sections.hasMany(db.products, {foreignKey: 'section_id'});
db.products.hasMany(db.categories, {foreignKey: 'product_id', onDelete: 'cascade', hooks: true});
db.categories.hasMany(db.subcategories, {foreignKey: 'category_id', onDelete: 'cascade', hooks: true});
db.categories.hasMany(db.fields, {foreignKey: 'category_id' , onDelete: 'cascade', hooks: true});
db.subcategories.hasMany(db.redeems, {foreignKey: 'sub_category_id' , onDelete: 'cascade', hooks: true});

module.exports = db;