module.exports = (sequelize, Sequelize) => {  
    const Role = require("./role.js")(sequelize, Sequelize);  
    const User = require("./user.js")(sequelize, Sequelize);
    const Order = require("./order.js")(sequelize, Sequelize);
  
    const Notification = sequelize.define("notifications", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      order_no: {
          type: Sequelize.STRING,
          allowNull : false
      },
      product_photo_url: {
          type: Sequelize.STRING,
          allowNull : false
      },
      product_name: {
          type: Sequelize.STRING,
          allowNull : false
      },        
      product_name_mm: {
          type: Sequelize.STRING,
          allowNull : false
      },   
      quantity: {
          type: Sequelize.INTEGER,
          allowNull : false,
          defaultValue : 1
      },     
      price: {
          type: Sequelize.DECIMAL(10,2),
          allowNull : false
      },
      tran_status: {
          type: Sequelize.STRING,
          allowNull : false,
          defaultValue : "Pending"
      },
      is_read : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      order_date : {
          type : Sequelize.DATE,
          defaultValue: Sequelize.NOW
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: Order,
          key: "id"
        },
        allowNull : false
      }
    }, {
        timestamps: false
    });
    
    Notification.belongsTo(Order, {as: 'Order', foreignKey: 'order_id', onDelete : 'CASCADE'}); // Adds order_id to Notification
  
    return Notification;
  };